class updateContaService{
    async execute(id, produto, banco_codigo, cedente_id, status, configuracao_notificacao) {
        const Conta = await Conta.findById(id);
        if (!Conta) {
            throw new Error("Conta não encontrada");  
        }
        const jaExisteConta = await Conta.findOne({ where: { cedente_id } });
        if (jaExisteConta) {
            throw new Error("Conta já cadastrada para este cedente");
        }
    }
}