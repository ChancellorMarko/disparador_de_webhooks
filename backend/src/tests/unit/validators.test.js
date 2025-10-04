const {
  isValidCNPJ,
  isValidCPF,
  isValidEmail,
  isValidPhone,
  isValidCEP,
  isValidDate,
  isValidUUID,
  sanitizeCNPJ,
  sanitizeCPF,
  sanitizePhone,
  sanitizeCEP,
} = require("../../src/utils/validators")

describe("Validators", () => {
  describe("isValidCNPJ", () => {
    it("should validate correct CNPJ with formatting", () => {
      expect(isValidCNPJ("11.222.333/0001-81")).toBe(true)
    })

    it("should validate correct CNPJ without formatting", () => {
      expect(isValidCNPJ("11222333000181")).toBe(true)
    })

    it("should reject invalid CNPJ", () => {
      expect(isValidCNPJ("11.222.333/0001-82")).toBe(false)
      expect(isValidCNPJ("00.000.000/0000-00")).toBe(false)
      expect(isValidCNPJ("11111111111111")).toBe(false)
    })

    it("should reject CNPJ with wrong length", () => {
      expect(isValidCNPJ("123")).toBe(false)
      expect(isValidCNPJ("123456789012345")).toBe(false)
    })

    it("should reject empty or null CNPJ", () => {
      expect(isValidCNPJ("")).toBe(false)
      expect(isValidCNPJ(null)).toBe(false)
      expect(isValidCNPJ(undefined)).toBe(false)
    })
  })

  describe("isValidCPF", () => {
    it("should validate correct CPF with formatting", () => {
      expect(isValidCPF("123.456.789-09")).toBe(true)
    })

    it("should validate correct CPF without formatting", () => {
      expect(isValidCPF("12345678909")).toBe(true)
    })

    it("should reject invalid CPF", () => {
      expect(isValidCPF("123.456.789-10")).toBe(false)
      expect(isValidCPF("000.000.000-00")).toBe(false)
      expect(isValidCPF("11111111111")).toBe(false)
    })

    it("should reject CPF with wrong length", () => {
      expect(isValidCPF("123")).toBe(false)
      expect(isValidCPF("123456789012")).toBe(false)
    })

    it("should reject empty or null CPF", () => {
      expect(isValidCPF("")).toBe(false)
      expect(isValidCPF(null)).toBe(false)
      expect(isValidCPF(undefined)).toBe(false)
    })
  })

  describe("isValidEmail", () => {
    it("should validate correct email addresses", () => {
      expect(isValidEmail("test@example.com")).toBe(true)
      expect(isValidEmail("user.name+tag@example.co.uk")).toBe(true)
      expect(isValidEmail("test123@test-domain.com")).toBe(true)
    })

    it("should reject invalid email addresses", () => {
      expect(isValidEmail("invalid")).toBe(false)
      expect(isValidEmail("invalid@")).toBe(false)
      expect(isValidEmail("@invalid.com")).toBe(false)
      expect(isValidEmail("invalid@.com")).toBe(false)
      expect(isValidEmail("invalid@domain")).toBe(false)
    })

    it("should reject empty or null email", () => {
      expect(isValidEmail("")).toBe(false)
      expect(isValidEmail(null)).toBe(false)
      expect(isValidEmail(undefined)).toBe(false)
    })
  })

  describe("isValidPhone", () => {
    it("should validate correct phone numbers", () => {
      expect(isValidPhone("(11) 98765-4321")).toBe(true)
      expect(isValidPhone("11987654321")).toBe(true)
      expect(isValidPhone("(11) 3456-7890")).toBe(true)
      expect(isValidPhone("1134567890")).toBe(true)
    })

    it("should reject invalid phone numbers", () => {
      expect(isValidPhone("123")).toBe(false)
      expect(isValidPhone("(11) 1234-567")).toBe(false)
      expect(isValidPhone("00000000000")).toBe(false)
    })

    it("should reject empty or null phone", () => {
      expect(isValidPhone("")).toBe(false)
      expect(isValidPhone(null)).toBe(false)
      expect(isValidPhone(undefined)).toBe(false)
    })
  })

  describe("isValidCEP", () => {
    it("should validate correct CEP", () => {
      expect(isValidCEP("12345-678")).toBe(true)
      expect(isValidCEP("12345678")).toBe(true)
    })

    it("should reject invalid CEP", () => {
      expect(isValidCEP("123")).toBe(false)
      expect(isValidCEP("12345-67")).toBe(false)
      expect(isValidCEP("00000-000")).toBe(false)
    })

    it("should reject empty or null CEP", () => {
      expect(isValidCEP("")).toBe(false)
      expect(isValidCEP(null)).toBe(false)
      expect(isValidCEP(undefined)).toBe(false)
    })
  })

  describe("isValidDate", () => {
    it("should validate correct dates", () => {
      expect(isValidDate("2024-01-15")).toBe(true)
      expect(isValidDate("15/01/2024")).toBe(true)
      expect(isValidDate(new Date())).toBe(true)
    })

    it("should reject invalid dates", () => {
      expect(isValidDate("2024-13-01")).toBe(false)
      expect(isValidDate("32/01/2024")).toBe(false)
      expect(isValidDate("invalid")).toBe(false)
    })

    it("should reject empty or null date", () => {
      expect(isValidDate("")).toBe(false)
      expect(isValidDate(null)).toBe(false)
      expect(isValidDate(undefined)).toBe(false)
    })
  })

  describe("isValidUUID", () => {
    it("should validate correct UUIDs", () => {
      expect(isValidUUID("550e8400-e29b-41d4-a716-446655440000")).toBe(true)
      expect(isValidUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true)
    })

    it("should reject invalid UUIDs", () => {
      expect(isValidUUID("invalid-uuid")).toBe(false)
      expect(isValidUUID("550e8400-e29b-41d4-a716")).toBe(false)
      expect(isValidUUID("550e8400e29b41d4a716446655440000")).toBe(false)
    })

    it("should reject empty or null UUID", () => {
      expect(isValidUUID("")).toBe(false)
      expect(isValidUUID(null)).toBe(false)
      expect(isValidUUID(undefined)).toBe(false)
    })
  })

  describe("sanitizeCNPJ", () => {
    it("should remove formatting from CNPJ", () => {
      expect(sanitizeCNPJ("11.222.333/0001-81")).toBe("11222333000181")
      expect(sanitizeCNPJ("11222333000181")).toBe("11222333000181")
    })

    it("should handle empty or null CNPJ", () => {
      expect(sanitizeCNPJ("")).toBe("")
      expect(sanitizeCNPJ(null)).toBe("")
      expect(sanitizeCNPJ(undefined)).toBe("")
    })
  })

  describe("sanitizeCPF", () => {
    it("should remove formatting from CPF", () => {
      expect(sanitizeCPF("123.456.789-09")).toBe("12345678909")
      expect(sanitizeCPF("12345678909")).toBe("12345678909")
    })

    it("should handle empty or null CPF", () => {
      expect(sanitizeCPF("")).toBe("")
      expect(sanitizeCPF(null)).toBe("")
      expect(sanitizeCPF(undefined)).toBe("")
    })
  })

  describe("sanitizePhone", () => {
    it("should remove formatting from phone", () => {
      expect(sanitizePhone("(11) 98765-4321")).toBe("11987654321")
      expect(sanitizePhone("11987654321")).toBe("11987654321")
    })

    it("should handle empty or null phone", () => {
      expect(sanitizePhone("")).toBe("")
      expect(sanitizePhone(null)).toBe("")
      expect(sanitizePhone(undefined)).toBe("")
    })
  })

  describe("sanitizeCEP", () => {
    it("should remove formatting from CEP", () => {
      expect(sanitizeCEP("12345-678")).toBe("12345678")
      expect(sanitizeCEP("12345678")).toBe("12345678")
    })

    it("should handle empty or null CEP", () => {
      expect(sanitizeCEP("")).toBe("")
      expect(sanitizeCEP(null)).toBe("")
      expect(sanitizeCEP(undefined)).toBe("")
    })
  })
})
