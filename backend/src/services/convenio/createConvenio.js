class createConvenioService{
    async execute(id, numero_convenio, conta_id) {
        const Convenio = await Convenio.findOne({id});
        if (Convenio) {
            throw new Error("Convênio já cadastrado");
        }
        await Convenio.create({id, numero_convenio, conta_id});
    }
}