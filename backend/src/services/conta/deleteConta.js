class deleteContaService{
    async execute(id) {
        const Conta = await Conta.findById(id);
        if(!Conta){
            throw new Error("Conta não encontrada");
        }
        await Conta.delete(id);
    }
}