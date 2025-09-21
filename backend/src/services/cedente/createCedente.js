class createCedenteService{
    async execute(cnpj, token, softwareHouse_id, status, configuracao_notificacao) {
        const Cedente = await Cedente.findOne({ cnpj });
        if (Cedente) {
            throw new Error("CNPJ já cadastrado");
        }
        await Cedente.create({ cnpj, token, softwareHouse_id, status, configuracao_notificacao });
    }

}