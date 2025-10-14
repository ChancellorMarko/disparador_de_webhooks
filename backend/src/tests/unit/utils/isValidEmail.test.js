const{
    isValidEmail
} = require("../../../utils/validators");


describe("isValidEmail", () => {
    it("deve retornar true para email válido", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
    });
    it("deve retornar false para email inválido", () => {
      expect(isValidEmail("test@.com")).toBe(false);
    });
  });