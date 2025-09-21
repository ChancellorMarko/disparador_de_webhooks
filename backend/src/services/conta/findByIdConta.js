class findByIdContaService{
    async execute(id) {
        const Conta = await Conta.findById(id);
        if (!Conta) {
            throw new Error("Conta não encontrada");
        }
        return Conta;
    }
}