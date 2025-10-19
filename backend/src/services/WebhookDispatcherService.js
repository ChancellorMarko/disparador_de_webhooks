const axios = require('axios');
const { WebhookReprocessado, Cedente, Conta } = require('../models');

class WebhookDispatcherService {
  static _montarPayloadFinal(webhook) {
    const { product, type } = webhook.data;

    // Mapeia o 'type' da nossa API para os status das fotos
    const situacaoMap = {
      disponivel: { boleto: 'DISPONIVEL', pagamento: 'PENDING', pix: 'PENDING' },
      cancelado: { boleto: 'BAIXADO', pagamento: 'REJECTED', pix: 'REJECTED' },
      pago: { boleto: 'LIQUIDADO', pagamento: 'PAID', pix: 'PIX_PAID' }
    };

    // >>> A CORREÇÃO ESTÁ AQUI <<<
    // Acessando o mapa na ordem correta: primeiro o 'type', depois o 'product'
    const statusFinal = situacaoMap[type]?.[product] || 'UNKNOWN';

    switch (product) {
      case 'boleto':
        return {
          body: {
            tipoWH: "notifica_liquidou",
            dataHoraEnvio: new Date().toISOString(),
            titulo: {
              situacao: statusFinal, // Agora virá 'DISPONIVEL'
              idIntegracao: `ID_${JSON.parse(webhook.servico_id).join(',')}`,
              TituloNossoNumero: "456456",
            },
            CpfCnpjCedente: webhook.cedente.cnpj
          }
        };

      // ... (os outros cases para 'pagamento' e 'pix' continuam iguais) ...
      case 'pagamento':
        return {
          body: { status: statusFinal, /* ... */ }
        };
      case 'pix':
        return {
          body: { event: statusFinal, /* ... */ }
        };

      default:
        return webhook.data;
    }
  }

  // A função processarFila() continua exatamente a mesma
  static async processarFila() {
    console.log('Buscando webhooks pendentes para processar...');

    const webhooksPendentes = await WebhookReprocessado.findAll({
      where: { status: 'pendente' },
      include: [{
        model: Cedente, as: 'cedente',
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
        const configConta = webhook.cedente?.contas?.[0]?.configuracao_notificacao;
        const configCedente = webhook.cedente?.configuracao_notificacao;

        if (configConta && configConta.url) {
          urlDeNotificacao = configConta.url;
        } else if (configCedente && configCedente.url) {
          urlDeNotificacao = configCedente.url;
        }

        if (!urlDeNotificacao) {
          throw new Error(`URL de notificação não configurada para o cedente ID ${webhook.cedente_id}`);
        }
        
        const payloadFinal = this._montarPayloadFinal(webhook);

        console.log(`Disparando webhook (Protocolo: ${webhook.id}) para a URL: ${urlDeNotificacao}`);
        
        await axios.post(urlDeNotificacao, payloadFinal);

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