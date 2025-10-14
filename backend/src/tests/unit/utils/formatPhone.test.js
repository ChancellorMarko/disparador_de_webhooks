const{
    formatPhone
} = require("../../../utils/validators");


describe("formatPhone", () => {
    it("deve formatar telefone corretamente", () => {
      expect(formatPhone("11999998888")).toBe("(11) 99999-8888");
    });
    it("deve retornar o valor original se não for possível formatar", () => {
      expect(formatPhone("123")).toBe("123");
    });
  });