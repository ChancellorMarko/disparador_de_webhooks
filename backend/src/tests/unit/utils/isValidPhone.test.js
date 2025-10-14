const{
    isValidPhone
} = require("../../../utils/validators");


describe("isValidPhone", () => {
    it("deve retornar true para telefone válido", () => {
      expect(isValidPhone("(11) 99999-8888")).toBe(true);
    });
    it("deve retornar false para telefone inválido", () => {
      expect(isValidPhone("1234")).toBe(false);
    });
  });