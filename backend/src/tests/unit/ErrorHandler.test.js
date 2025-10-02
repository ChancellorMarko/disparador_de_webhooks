const ErrorHandler = require("../../src/utils/ErrorHandler")
const logger = require("../../src/config/logger")
const jest = require("jest")

jest.mock("../../src/config/logger")

describe("ErrorHandler", () => {
  let mockReq, mockRes

  beforeEach(() => {
    mockReq = {
      method: "GET",
      originalUrl: "/api/test",
      ip: "127.0.0.1",
      headers: { "user-agent": "test-agent" },
    }

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    jest.clearAllMocks()
  })

  describe("handleError", () => {
    it("should handle validation errors", () => {
      const error = new Error("Validation failed")
      error.name = "ValidationError"

      ErrorHandler.handleError(error, mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(400)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Erro de validação",
          message: "Validation failed",
        }),
      )
    })

    it("should handle authentication errors", () => {
      const error = new Error("Token inválido")
      error.name = "JsonWebTokenError"

      ErrorHandler.handleError(error, mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(401)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Erro de autenticação",
        }),
      )
    })

    it("should handle database errors", () => {
      const error = new Error("Database connection failed")
      error.name = "SequelizeConnectionError"

      ErrorHandler.handleError(error, mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Erro de banco de dados",
        }),
      )
    })

    it("should handle custom API errors", () => {
      const error = {
        statusCode: 404,
        message: "Resource not found",
        isOperational: true,
      }

      ErrorHandler.handleError(error, mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(404)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Resource not found",
        }),
      )
    })

    it("should handle generic errors", () => {
      const error = new Error("Something went wrong")

      ErrorHandler.handleError(error, mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Erro interno do servidor",
        }),
      )
    })

    it("should log errors", () => {
      const error = new Error("Test error")

      ErrorHandler.handleError(error, mockReq, mockRes)

      expect(logger.error).toHaveBeenCalled()
    })

    it("should include stack trace in development", () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = "development"

      const error = new Error("Test error")
      ErrorHandler.handleError(error, mockReq, mockRes)

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: expect.any(String),
        }),
      )

      process.env.NODE_ENV = originalEnv
    })

    it("should not include stack trace in production", () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = "production"

      const error = new Error("Test error")
      ErrorHandler.handleError(error, mockReq, mockRes)

      const jsonCall = mockRes.json.mock.calls[0][0]
      expect(jsonCall.stack).toBeUndefined()

      process.env.NODE_ENV = originalEnv
    })
  })

  describe("createError", () => {
    it("should create operational error", () => {
      const error = ErrorHandler.createError("Test error", 400)

      expect(error.message).toBe("Test error")
      expect(error.statusCode).toBe(400)
      expect(error.isOperational).toBe(true)
    })

    it("should use default status code", () => {
      const error = ErrorHandler.createError("Test error")

      expect(error.statusCode).toBe(500)
    })
  })

  describe("asyncHandler", () => {
    it("should handle async function success", async () => {
      const asyncFn = jest.fn().mockResolvedValue({ data: "test" })
      const wrappedFn = ErrorHandler.asyncHandler(asyncFn)

      await wrappedFn(mockReq, mockRes)

      expect(asyncFn).toHaveBeenCalledWith(mockReq, mockRes)
    })

    it("should catch async function errors", async () => {
      const error = new Error("Async error")
      const asyncFn = jest.fn().mockRejectedValue(error)
      const wrappedFn = ErrorHandler.asyncHandler(asyncFn)
      const mockNext = jest.fn()

      await wrappedFn(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe("notFound", () => {
    it("should create 404 error", () => {
      const mockNext = jest.fn()

      ErrorHandler.notFound(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 404,
          message: expect.stringContaining("/api/test"),
        }),
      )
    })
  })
})
