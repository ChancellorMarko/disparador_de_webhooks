class reenviarService {
  async validarReenvio({ product, id, kind, type }) {
    // Validar paramêtros obrigatórios
    if (!product || !id || !kind || !type) {
      throw new Error("Parâmetros obrigatórios: product, id, kind e type");
    }
    // Validar o produto
    const produtosValidos = ["boleto", "pagamento", "pix"];
    if (!produtosValidos.includes(product)) {
      throw new Error(
        "Produto inválido. Produtos válidos: boleto, pagamento, pix"
      );
    }
    //Validar o ID
    if (!Array.isArray(id) || !id.every((item) => typeof item === "string")) {
      throw new Error("id deve ser um array de strings");
    }
    if (id.length === 0 || id.length > 30) {
      throw new Error("O array de IDs deve ter entre 1 e 30 elementos");
    }
    //Validar kind
    if (kind !== "webhook") {
      throw new Error("Kind inválido. Atualmente só é permitido: webhook");
    }
    //Validar type
    const tiposValidos = ["disponivel", "cancelado", "pago"];
    if (!tiposValidos.includes(type)) {
      throw new Error(`Type inválido. Aceitos: ${tiposValidos.join(", ")}`);
    }
    return { valido: true, product, id, kind, type };
  }
}
