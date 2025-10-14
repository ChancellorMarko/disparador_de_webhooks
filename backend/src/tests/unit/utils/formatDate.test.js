const{
    formatDate
} = require("../../../utils/validators");


describe("formatDate", () => {
    it("deve formatar data corretamente", () => {
      const date = new Date("2023-12-25");
      expect(formatDate(date)).toBe("25/12/2023");
      expect(formatDate("2023-12-25")).toBe("25/12/2023");
    });

    it("deve retornar o valor original se não for possível formatar", () => {
      expect(formatDate("not-a-date")).toBe("not-a-date");
    });
  });