class updateServicoService{
    async execute({id, convenio_id, status}){
        const Servico = await Servico.findById(id);
        if(!Servico){
            throw new Error("Serviço não encontrado");
        }
        await Servico.update(id, {convenio_id, status});
        
    }
}