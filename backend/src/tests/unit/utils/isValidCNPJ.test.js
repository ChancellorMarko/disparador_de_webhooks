const{
    isValidCNPJ
} = require("../../../utils/validators");

describe("isValidCNPJ", () => {
    it("deve retornar true para CNPJ válido", () => {
      expect(isValidCNPJ("33.000.167/0001-01")).toBe(true);
    });
    it("deve retornar false para CNPJ inválido", () => {
      // Um CNPJ com todos os números iguais é inválido
      expect(isValidCNPJ("11.111.111/1111-11")).toBe(false); 
    });
  });