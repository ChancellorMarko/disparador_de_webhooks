class findByIdWebHookReprocessado {
    async execute(id) {
        const WebHookReprocessado = await WebHookReprocessado.findById(id);
        if (!WebHookReprocessado) {
            throw new Error("WebHookReprocessado não encontrado");
        }
        return WebHookReprocessado;
    }
}