const { SoftwareHouse, Cedente } = require("../models");

const shAuth = async (req, res, next) => {
  try {
    // 1. Nomes dos headers alinhados com a nova documentação
    const cnpjSh = req.headers['x-api-cnpj-sh'];
    const tokenSh = req.headers['x-api-token-sh'];
    const cnpjCedente = req.headers['x-api-cnpj-cedente'];
    const tokenCedente = req.headers['x-api-token-cedente'];

    // 2. Validação unificada
    if (!cnpjSh || !tokenSh || !cnpjCedente || !tokenCedente) {
      return res.status(401).json({ message: "Não autorizado" });
    }

    const softwareHouse = await SoftwareHouse.findOne({ where: { cnpj: cnpjSh, token: tokenSh } });

    // 3. Retorno de erro padronizado para todas as falhas
    if (!softwareHouse || softwareHouse.status !== 'ativo') {
      return res.status(401).json({ message: "Não autorizado" });
    }

    const cedente = await Cedente.findOne({
        where: {
            cnpj: cnpjCedente,
            token: tokenCedente,
            softwarehouse_id: softwareHouse.id 
        }
    });

    if (!cedente || cedente.status !== 'ativo') {
        return res.status(401).json({ message: "Não autorizado" });
    }

    // Anexa o cedente e a SH na requisição
    req.cedente = cedente;
    req.softwareHouse = softwareHouse;

    next();
  } catch (error) {
    console.error("Erro inesperado no middleware shAuth:", error);
    return res.status(401).json({ message: "Não autorizado" });
  }
};

module.exports = { shAuth };