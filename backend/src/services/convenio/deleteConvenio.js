class deleteConvenioService{
    async execute(id) {
        const Convenio = await Convenio.findById(id);
        if(!Convenio){
            throw new Error("Convênio não encontrado");
        }
        await Convenio.delete(id);

    }
        
}