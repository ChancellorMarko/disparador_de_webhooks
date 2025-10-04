class deleteWebhookReprocessadoService {
    async execute(id) {
    const WebhookReprocessado = await WebhookReprocessado.findById(id);
    if (!WebhookReprocessado) {
        throw new Error("Webhook Reprocessado não encontrado");
    }
    await WebhookReprocessado.delete(id);
    }
}