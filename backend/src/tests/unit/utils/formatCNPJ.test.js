const{
    formatCNPJ
} = require("../../../utils/validators");


describe("formatCNPJ", () => {
    it("deve formatar CNPJ corretamente", () => {
      expect(formatCNPJ("33000167000101")).toBe("33.000.167/0001-01");
    });
    it("deve retornar o valor original se não for possível formatar", () => {
      expect(formatCNPJ("123")).toBe("123");
    });
  });