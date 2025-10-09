const axios = require('axios');
const { WebhookReprocessado, Cedente, Conta } = require('../models'); // Verifique o caminho para seus models

class WebhookDispatcherService {
  static async processarFila() {
    console.log('Buscando webhooks pendentes para processar...');

    // 1. Busca no banco todos os webhooks com status 'pendente'
    const webhooksPendentes = await WebhookReprocessado.findAll({
      where: { status: 'pendente' },
      include: [{ // Inclui os dados do Cedente e das Contas para pegar a URL
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

    // 2. Faz um loop por cada webhook pendente
    for (const webhook of webhooksPendentes) {
      try {
        // 3. Lógica para pegar a URL de notificação (a da Conta tem prioridade)
        let urlDeNotificacao;
        // Lógica simplificada para pegar a config da primeira conta, se houver
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

        console.log(`Disparando webhook (Protocolo: ${webhook.id}) para a URL: ${urlDeNotificacao}`);
        
        // 4. Usa o axios para enviar a notificação (os dados originais do reenvio)
        await axios.post(urlDeNotificacao, webhook.data);

        // 5. Se o envio deu certo, atualiza o status para 'enviado'
        webhook.status = 'enviado';
        await webhook.save();
        console.log(`Webhook (Protocolo: ${webhook.id}) enviado com sucesso.`);

      } catch (error) {
        console.error(`Falha ao enviar o webhook (Protocolo: ${webhook.id}):`, error.message);
        // 6. Se deu erro, atualiza o status para 'falhou'
        webhook.status = 'falhou';
        await webhook.save();
      }
    }
    console.log('Processamento da fila de webhooks finalizado.');
  }
}

module.exports = WebhookDispatcherService;