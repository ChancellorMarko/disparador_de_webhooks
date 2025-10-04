const {
  formatCNPJ,
  formatCPF,
  formatPhone,
  formatCEP,
  formatDate,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  truncateText,
} = require("../../src/utils/formatters")

describe("Formatters", () => {
  describe("formatCNPJ", () => {
    it("should format CNPJ correctly", () => {
      expect(formatCNPJ("11222333000181")).toBe("11.222.333/0001-81")
    })

    it("should handle already formatted CNPJ", () => {
      expect(formatCNPJ("11.222.333/0001-81")).toBe("11.222.333/0001-81")
    })

    it("should handle invalid CNPJ", () => {
      expect(formatCNPJ("123")).toBe("123")
      expect(formatCNPJ("")).toBe("")
      expect(formatCNPJ(null)).toBe("")
    })
  })

  describe("formatCPF", () => {
    it("should format CPF correctly", () => {
      expect(formatCPF("12345678909")).toBe("123.456.789-09")
    })

    it("should handle already formatted CPF", () => {
      expect(formatCPF("123.456.789-09")).toBe("123.456.789-09")
    })

    it("should handle invalid CPF", () => {
      expect(formatCPF("123")).toBe("123")
      expect(formatCPF("")).toBe("")
      expect(formatCPF(null)).toBe("")
    })
  })

  describe("formatPhone", () => {
    it("should format mobile phone correctly", () => {
      expect(formatPhone("11987654321")).toBe("(11) 98765-4321")
    })

    it("should format landline correctly", () => {
      expect(formatPhone("1134567890")).toBe("(11) 3456-7890")
    })

    it("should handle already formatted phone", () => {
      expect(formatPhone("(11) 98765-4321")).toBe("(11) 98765-4321")
    })

    it("should handle invalid phone", () => {
      expect(formatPhone("123")).toBe("123")
      expect(formatPhone("")).toBe("")
      expect(formatPhone(null)).toBe("")
    })
  })

  describe("formatCEP", () => {
    it("should format CEP correctly", () => {
      expect(formatCEP("12345678")).toBe("12345-678")
    })

    it("should handle already formatted CEP", () => {
      expect(formatCEP("12345-678")).toBe("12345-678")
    })

    it("should handle invalid CEP", () => {
      expect(formatCEP("123")).toBe("123")
      expect(formatCEP("")).toBe("")
      expect(formatCEP(null)).toBe("")
    })
  })

  describe("formatDate", () => {
    it("should format date to Brazilian format", () => {
      const date = new Date("2024-01-15T10:30:00")
      expect(formatDate(date)).toMatch(/15\/01\/2024/)
    })

    it("should format date with custom format", () => {
      const date = new Date("2024-01-15T10:30:00")
      expect(formatDate(date, "yyyy-MM-dd")).toBe("2024-01-15")
    })

    it("should handle string dates", () => {
      expect(formatDate("2024-01-15")).toMatch(/15\/01\/2024/)
    })

    it("should handle invalid dates", () => {
      expect(formatDate("invalid")).toBe("Data inválida")
      expect(formatDate(null)).toBe("Data inválida")
    })
  })

  describe("formatCurrency", () => {
    it("should format currency in BRL", () => {
      expect(formatCurrency(1234.56)).toBe("R$ 1.234,56")
      expect(formatCurrency(0)).toBe("R$ 0,00")
      expect(formatCurrency(1000000)).toBe("R$ 1.000.000,00")
    })

    it("should handle negative values", () => {
      expect(formatCurrency(-1234.56)).toBe("-R$ 1.234,56")
    })

    it("should handle invalid values", () => {
      expect(formatCurrency(null)).toBe("R$ 0,00")
      expect(formatCurrency(undefined)).toBe("R$ 0,00")
      expect(formatCurrency("invalid")).toBe("R$ 0,00")
    })
  })

  describe("formatPercentage", () => {
    it("should format percentage correctly", () => {
      expect(formatPercentage(0.1234)).toBe("12,34%")
      expect(formatPercentage(1)).toBe("100,00%")
      expect(formatPercentage(0)).toBe("0,00%")
    })

    it("should handle custom decimal places", () => {
      expect(formatPercentage(0.12345, 3)).toBe("12,345%")
      expect(formatPercentage(0.1, 0)).toBe("10%")
    })

    it("should handle invalid values", () => {
      expect(formatPercentage(null)).toBe("0,00%")
      expect(formatPercentage(undefined)).toBe("0,00%")
    })
  })

  describe("formatFileSize", () => {
    it("should format file sizes correctly", () => {
      expect(formatFileSize(0)).toBe("0 Bytes")
      expect(formatFileSize(1024)).toBe("1 KB")
      expect(formatFileSize(1048576)).toBe("1 MB")
      expect(formatFileSize(1073741824)).toBe("1 GB")
    })

    it("should handle decimal values", () => {
      expect(formatFileSize(1536)).toBe("1.5 KB")
      expect(formatFileSize(2621440)).toBe("2.5 MB")
    })

    it("should handle invalid values", () => {
      expect(formatFileSize(null)).toBe("0 Bytes")
      expect(formatFileSize(undefined)).toBe("0 Bytes")
      expect(formatFileSize(-100)).toBe("0 Bytes")
    })
  })

  describe("truncateText", () => {
    it("should truncate long text", () => {
      const text = "This is a very long text that needs to be truncated"
      expect(truncateText(text, 20)).toBe("This is a very lo...")
    })

    it("should not truncate short text", () => {
      const text = "Short text"
      expect(truncateText(text, 20)).toBe("Short text")
    })

    it("should handle custom suffix", () => {
      const text = "This is a very long text"
      expect(truncateText(text, 15, "…")).toBe("This is a very…")
    })

    it("should handle invalid inputs", () => {
      expect(truncateText(null, 10)).toBe("")
      expect(truncateText(undefined, 10)).toBe("")
      expect(truncateText("", 10)).toBe("")
    })
  })
})
