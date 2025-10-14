// Usa 'require' em vez de 'import'
const {
  isValidCNPJ,
  formatCNPJ,
  isValidEmail,
  isValidPhone,
  formatPhone,
  isValidDate,
  formatDate,
} = require("../../../utils/validators"); // Ajuste o caminho se necessário

describe("Validators Utils", () => {
  describe("isValidCNPJ", () => {
    it("deve retornar true para CNPJ válido", () => {
      expect(isValidCNPJ("33.000.167/0001-01")).toBe(true);
    });
    it("deve retornar false para CNPJ inválido", () => {
      // Um CNPJ com todos os números iguais é inválido
      expect(isValidCNPJ("11.111.111/1111-11")).toBe(false); 
    });
  });

  describe("formatCNPJ", () => {
    it("deve formatar CNPJ corretamente", () => {
      expect(formatCNPJ("33000167000101")).toBe("33.000.167/0001-01");
    });
    it("deve retornar o valor original se não for possível formatar", () => {
      expect(formatCNPJ("123")).toBe("123");
    });
  });

  describe("isValidEmail", () => {
    it("deve retornar true para email válido", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
    });
    it("deve retornar false para email inválido", () => {
      expect(isValidEmail("test@.com")).toBe(false);
    });
  });

  describe("isValidPhone", () => {
    it("deve retornar true para telefone válido", () => {
      expect(isValidPhone("(11) 99999-8888")).toBe(true);
    });
    it("deve retornar false para telefone inválido", () => {
      expect(isValidPhone("1234")).toBe(false);
    });
  });

  describe("formatPhone", () => {
    it("deve formatar telefone corretamente", () => {
      expect(formatPhone("11999998888")).toBe("(11) 99999-8888");
    });
    it("deve retornar o valor original se não for possível formatar", () => {
      expect(formatPhone("123")).toBe("123");
    });
  });

  describe("isValidDate", () => {
    it("deve retornar true para data válida", () => {
      expect(isValidDate("2023-12-25")).toBe(true);
    });
    it("deve retornar false para data inválida", () => {
      expect(isValidDate("invalid-date")).toBe(false);
    });
  });

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
});