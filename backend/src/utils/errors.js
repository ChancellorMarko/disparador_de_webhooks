class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = "Erro de validação", statusCode = 422) {
    super(message, statusCode);
  }
}

// Exporta tanto o objeto quanto as classes individualmente para garantir compatibilidade
module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
};
