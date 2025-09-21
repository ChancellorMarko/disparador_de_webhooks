class findByIdServicoService{
    async execute(id){
        const Servico = await Servico.findById(id);
        if(!Servico){
            throw new Error("Serviço não encontrado");
        }
        return Servico;
    }
}