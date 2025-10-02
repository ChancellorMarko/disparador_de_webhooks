const RateLimiter = require("../../src/middleware/rateLimiter")
const redis = require("../../src/config/redis")
const jest = require("jest")

jest.mock("../../src/config/redis")

describe("RateLimiter", () => {
  let mockReq, mockRes, mockNext

  beforeEach(() => {
    mockReq = {
      ip: "127.0.0.1",
      path: "/api/test",
      softwareHouse: { id: 1 },
    }

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      setHeader: jest.fn(),
    }

    mockNext = jest.fn()

    jest.clearAllMocks()
  })

  describe("standard rate limiting", () => {
    it("should allow requests within limit", async () => {
      redis.get.mockResolvedValue("5")
      redis.ttl.mockResolvedValue(30)

      const limiter = RateLimiter.createLimiter({ max: 10, windowMs: 60000 })
      await limiter(mockReq, mockRes, mockNext)

      expect(mockNext).toHaveBeenCalled()
      expect(mockRes.setHeader).toHaveBeenCalledWith("X-RateLimit-Limit", 10)
      expect(mockRes.setHeader).toHaveBeenCalledWith("X-RateLimit-Remaining", 5)
    })

    it("should block requests exceeding limit", async () => {
      redis.get.mockResolvedValue("10")
      redis.ttl.mockResolvedValue(30)

      const limiter = RateLimiter.createLimiter({ max: 10, windowMs: 60000 })
      await limiter(mockReq, mockRes, mockNext)

      expect(mockNext).not.toHaveBeenCalled()
      expect(mockRes.status).toHaveBeenCalledWith(429)
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: "Muitas requisições",
        }),
      )
    })

    it("should increment request count", async () => {
      redis.get.mockResolvedValue("5")
      redis.ttl.mockResolvedValue(30)
      redis.incr.mockResolvedValue(6)

      const limiter = RateLimiter.createLimiter({ max: 10, windowMs: 60000 })
      await limiter(mockReq, mockRes, mockNext)

      expect(redis.incr).toHaveBeenCalled()
    })

    it("should set expiry for new keys", async () => {
      redis.get.mockResolvedValue(null)
      redis.incr.mockResolvedValue(1)
      redis.ttl.mockResolvedValue(-1)

      const limiter = RateLimiter.createLimiter({ max: 10, windowMs: 60000 })
      await limiter(mockReq, mockRes, mockNext)

      expect(redis.expire).toHaveBeenCalledWith(expect.any(String), 60)
    })
  })

  describe("key generation", () => {
    it("should use IP address for unauthenticated requests", async () => {
      delete mockReq.softwareHouse
      redis.get.mockResolvedValue("1")

      const limiter = RateLimiter.createLimiter({ max: 10, windowMs: 60000 })
      await limiter(mockReq, mockRes, mockNext)

      expect(redis.get).toHaveBeenCalledWith(expect.stringContaining("127.0.0.1"))
    })

    it("should use software house ID for authenticated requests", async () => {
      redis.get.mockResolvedValue("1")

      const limiter = RateLimiter.createLimiter({ max: 10, windowMs: 60000 })
      await limiter(mockReq, mockRes, mockNext)

      expect(redis.get).toHaveBeenCalledWith(expect.stringContaining("sh:1"))
    })

    it("should include path in key", async () => {
      redis.get.mockResolvedValue("1")

      const limiter = RateLimiter.createLimiter({ max: 10, windowMs: 60000 })
      await limiter(mockReq, mockRes, mockNext)

      expect(redis.get).toHaveBeenCalledWith(expect.stringContaining("/api/test"))
    })
  })

  describe("error handling", () => {
    it("should handle Redis errors gracefully", async () => {
      redis.get.mockRejectedValue(new Error("Redis error"))

      const limiter = RateLimiter.createLimiter({ max: 10, windowMs: 60000 })
      await limiter(mockReq, mockRes, mockNext)

      // Should allow request to proceed on Redis error
      expect(mockNext).toHaveBeenCalled()
    })
  })

  describe("custom options", () => {
    it("should respect custom max limit", async () => {
      redis.get.mockResolvedValue("50")

      const limiter = RateLimiter.createLimiter({ max: 50, windowMs: 60000 })
      await limiter(mockReq, mockRes, mockNext)

      expect(mockRes.setHeader).toHaveBeenCalledWith("X-RateLimit-Limit", 50)
    })

    it("should respect custom window", async () => {
      redis.get.mockResolvedValue(null)
      redis.incr.mockResolvedValue(1)
      redis.ttl.mockResolvedValue(-1)

      const limiter = RateLimiter.createLimiter({ max: 10, windowMs: 120000 })
      await limiter(mockReq, mockRes, mockNext)

      expect(redis.expire).toHaveBeenCalledWith(expect.any(String), 120)
    })

    it("should use custom message", async () => {
      redis.get.mockResolvedValue("10")

      const customMessage = "Custom rate limit message"
      const limiter = RateLimiter.createLimiter({
        max: 10,
        windowMs: 60000,
        message: customMessage,
      })
      await limiter(mockReq, mockRes, mockNext)

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: customMessage,
        }),
      )
    })
  })
})
