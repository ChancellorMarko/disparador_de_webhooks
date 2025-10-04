class updateCedenteService{
    async execute(id, cnpj, token, softwareHouse_id, status, configuracao_notificacao) {
        const Cedente = await Cedente.findById(id);
        if (!Cedente) {
            throw new Error("Cedente não encontrado");  
        }
        const jaExisteCedente = await Cedente.findOne({ where: { cnpj } });
        if (jaExisteCedente) {
            throw new Error("CNPJ já cadastrado");
        }
        await Cedente.update(id, { cnpj, token, softwareHouse_id, status, configuracao_notificacao });
    }
}