const { SoftwareHouse } = require("../models");

const shAuthSimple = async (req, res, next) => {
  try {
    // 1. Corrigido: Nomes dos headers alinhados com a documentação
    const cnpjSh = req.headers['x-api-cnpj-sh'];
    const tokenSh = req.headers['x-api-token-sh'];

    // 2. Corrigido: Validação unificada com resposta de erro padrão
    if (!cnpjSh || !tokenSh) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    const softwareHouse = await SoftwareHouse.findOne({ where: { cnpj: cnpjSh, token: tokenSh } });

    // 3. Corrigido: Verifica se a SH existe E se está ativa
    if (!softwareHouse || softwareHouse.status !== 'ativo') {
      return res.status(401).json({ message: "Não autorizado" });
    }

    // Se tudo estiver certo, anexa a SH na requisição e continua
    req.softwareHouse = softwareHouse;
    next();
  } catch (error) {
    // Para qualquer outro erro, também retorna o padrão de segurança
    console.error("Erro inesperado no middleware shAuthSimple:", error);
    return res.status(401).json({ message: "Não autorizado" });
  }
};

module.exports = { shAuthSimple };