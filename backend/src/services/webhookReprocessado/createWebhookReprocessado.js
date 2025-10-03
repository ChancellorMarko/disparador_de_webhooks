class createwebhookReprocessadoService {
    async execute(data, cedente_id, kind, serviço_id) {
        const webhookReprocessado = await webhookReprocessado.findOne({ data, cedente_id, kind, serviço_id });
        if (webhookReprocessado) {
            throw new Error("Webhook Reprocessado já cadastrado");
        }
        await webhookReprocessado.create({ data, cedente_id, kind, serviço_id });

    }
}