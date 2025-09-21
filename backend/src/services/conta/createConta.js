class createContaService{
    async execute(produto, banco_codigo, cedente_id, status, configuracao_notificacao) {
        const Conta = await Conta.findOne({cedente_id});
        //if (Conta) {
           // throw new Error(
            
            }
    }