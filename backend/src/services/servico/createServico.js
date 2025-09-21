class createServicoService{
    async execute(convenio_id, status) {
        const Servico = await Servico.findOne({convenio_id});
        if(Servico){
            throw new Error("Convênio já cadastrado");
        }
        await Servico.create({convenio_id, status});
    }

}