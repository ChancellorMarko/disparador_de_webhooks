class updateWebhookReprocessadoService {
    async execute({ id, data, cedente_id, kind, type, serviço_id }) {
        const WebhookReprocessado = await WebhookReprocessado.findById(id);
        if (!WebhookReprocessado) {
            throw new Error("Webhook Reprocessado não encontrado");
        }
        await WebhookReprocessado.update(id, { data, cedente_id, kind, type, serviço_id });
    }
}