class updateConvenioSerbice{
    async execute(id, numero_convenio, conta_id) {
        const Convenio = await Convenio.findById(id);
        if (!Convenio) {
            throw new Error("Convênio não encontrado");
        }
        const jaExisteConvenio = await Convenio.findOne({ where: { numero_convenio } });
        if (jaExisteConvenio) {
            throw new Error("Número do convênio já cadastrado");
        }
        await Convenio.update(id, { numero_convenio, conta_id });
        
    }
}