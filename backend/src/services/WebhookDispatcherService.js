const axios = require('axios');
// Certifique-se de que todos os seus models estão importados corretamente
const { WebhookReprocessado, Cedente, Conta } = require('../models');

class WebhookDispatcherService {
    /**
     * Monta o payload final da notificação com a estrutura completa.
     * @param {object} webhook - O objeto do webhook vindo do banco.
     * @param {object} configuracao - O objeto de configuração de notificação.
     * @returns {object} O payload final pronto para ser enviado.
     */
    static _montarPayloadFinal(webhook, configuracao) {
        const { product, type } = webhook.data;
        
        // Mapeamento de status conforme a tabela da documentação
        const situacaoMap = {
            disponivel: { boleto: 'REGISTRADO', pagamento: 'SCHEDULED_ACTIVE', pix: 'ACTIVE' },
            cancelado: { boleto: 'BAIXADO', pagamento: 'CANCELLED', pix: 'REJECTED' },
            pago: { boleto: 'LIQUIDADO', pagamento: 'PAID', pix: 'LIQUIDATED' }
        };

        const statusFinal = situacaoMap[type]?.[product] || 'UNKNOWN';
        let body = {};

        // Monta o corpo interno da notificação
        switch (product) {
            case 'boleto':
                body = {
                    tipoWH: "notifica_liquidou",
                    dataHoraEnvio: new Date().toISOString(),
                    titulo: {
                        situacao: statusFinal,
                        idIntegracao: `ID_${JSON.parse(webhook.servico_id).join(',')}`,
                        TituloNossoNumero: "456456", // Valor de exemplo
                        TituloMovimentos: {}
                    },
                    CpfCnpjCedente: webhook.cedente.cnpj
                };
                break;
            
            case 'pagamento':
                 body = {
                    status: statusFinal,
                    uniqueId: "VFML6N", // Exemplo, substitua por dados reais se tiver
                    createdAt: new Date().toISOString(),
                    occurrences: [],
                    accountHash: "igIFASIU" // Exemplo
                };
                break;

            case 'pix':
                body = {
                    type: "SEND_WEBHOOK",
                    companyID: "0000", // Exemplo
                    event: statusFinal,
                    transactionId: webhook.id, // Exemplo
                    tags: ["#YVw9SnBskO", "pix", "2024"],
                    id: { pixId: "00000000" } // Exemplo
                };
                break;

            default:
                throw new Error(`Produto '${product}' não é válido para montar notificação.`);
        }

        // Retorna a estrutura final completa com o "envelope" notifications
        return {
            notifications: [{
                kind: "webhook",
                method: "POST",
                url: configuracao.url,
                headers: "defaultHeaders", // Valor de exemplo
                body: body
            }]
        };
    }

    static async processarFila() {
        const webhooksPendentes = await WebhookReprocessado.findAll({
            where: { status: 'pendente' },
            include: [{
                model: Cedente,
                as: 'cedente',
                include: [{ model: Conta, as: 'contas' }]
            }]
        });

        if (webhooksPendentes.length === 0) {
            console.log('Nenhum webhook pendente encontrado.');
            return;
        }

        console.log(`Encontrados ${webhooksPendentes.length} webhooks para processar.`);

        for (const webhook of webhooksPendentes) {
            try {
                let urlDeNotificacao;
                let configuracao;

                const configConta = webhook.cedente?.contas?.[0]?.configuracao_notificacao;
                const configCedente = webhook.cedente?.configuracao_notificacao;

                if (configConta && configConta.url) {
                    urlDeNotificacao = configConta.url;
                    configuracao = configConta;
                } else if (configCedente && configCedente.url) {
                    urlDeNotificacao = configCedente.url;
                    configuracao = configCedente;
                }

                if (!urlDeNotificacao) {
                    throw new Error(`URL de notificação não configurada para o cedente ID ${webhook.cedente_id}`);
                }
                
                // Passamos a configuração para a função que monta o payload
                const payloadFinal = this._montarPayloadFinal(webhook, configuracao);

                const headers = { 'Content-Type': 'application/json' };
                if (configuracao) {
                    if (configuracao.header && configuracao.header_campo && configuracao.header_valor) {
                        headers[configuracao.header_campo] = configuracao.header_valor;
                    }
                    if (configuracao.headers_adicionais && Array.isArray(configuracao.headers_adicionais)) {
                        configuracao.headers_adicionais.forEach(headerObj => Object.assign(headers, headerObj));
                    }
                }

                console.log(`Disparando webhook (Protocolo: ${webhook.id}) para a URL: ${urlDeNotificacao}`);
                
                await axios.post(urlDeNotificacao, payloadFinal, { headers });

                webhook.status = 'enviado';
                await webhook.save();
                console.log(`Webhook (Protocolo: ${webhook.id}) enviado com sucesso.`);

            } catch (error) {
                console.error(`Falha ao enviar o webhook (Protocolo: ${webhook.id}):`, error.message);
                webhook.status = 'falhou';
                await webhook.save();
            }
        }
        console.log('Processamento da fila de webhooks finalizado.');
    }
}

module.exports = WebhookDispatcherService;