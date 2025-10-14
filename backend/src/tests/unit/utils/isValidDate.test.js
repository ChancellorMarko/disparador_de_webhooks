const{
    isValidDate
} = require("../../../utils/validators");


describe("isValidDate", () => {
    it("deve retornar true para data válida", () => {
      expect(isValidDate("2023-12-25")).toBe(true);
    });
    it("deve retornar false para data inválida", () => {
      expect(isValidDate("invalid-date")).toBe(false);
    });
  });