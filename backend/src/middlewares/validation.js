const AuthenticationService = require('../services/AuthenticationService');
const Joi = require('joi');

/**
 * Middleware para validar headers obrigatórios
 * Verifica se os headers cnpj-sh e token-sh estão presentes e válidos
 */
const validateRequiredHeaders = async (req, res, next) => {
  try {
    const { 'cnpj-sh': cnpjSh, 'token-sh': tokenSh } = req.headers;

    if (!cnpjSh) {
      return res.status(400).json({
        success: false,
        error: 'Header cnpj-sh é obrigatório',
        code: 'MISSING_CNPJ_SH_HEADER',
        field: 'cnpj-sh'
      });
    }

    if (!tokenSh) {
      return res.status(400).json({
        success: false,
        error: 'Header token-sh é obrigatório',
        code: 'MISSING_TOKEN_SH_HEADER',
        field: 'token-sh'
      });
    }

    if (!isValidCNPJFormat(cnpjSh)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de CNPJ inválido. Use: XX.XXX.XXX/XXXX-XX',
        code: 'INVALID_CNPJ_FORMAT',
        field: 'cnpj-sh'
      });
    }

    if (!isValidTokenSHFormat(tokenSh)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de token-sh inválido',
        code: 'INVALID_TOKEN_SH_FORMAT',
        field: 'token-sh'
      });
    }

    const softwareHouse = await AuthenticationService.validateSoftwareHouseByToken(tokenSh);
    
    if (!softwareHouse) {
      return res.status(401).json({
        success: false,
        error: 'Token SH inválido ou Software House inativa',
        code: 'INVALID_TOKEN_SH'
      });
    }

    if (softwareHouse.cnpj !== cnpjSh) {
      return res.status(403).json({
        success: false,
        error: 'CNPJ não corresponde ao token SH fornecido',
        code: 'CNPJ_TOKEN_MISMATCH'
      });
    }

    req.softwareHouse = {
      id: softwareHouse.id,
      cnpj: softwareHouse.cnpj,
      razao_social: softwareHouse.razao_social,
      nome_fantasia: softwareHouse.nome_fantasia,
      email: softwareHouse.email,
      token_sh: softwareHouse.token_sh,
      ativo: softwareHouse.ativo
    };

    next();
  } catch (error) {
    console.error('Erro na validação de headers:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno na validação de headers',
      code: 'HEADER_VALIDATION_ERROR'
    });
  }
};

/**
 * Middleware para validar headers opcionais
 */
const validateOptionalHeaders = async (req, res, next) => {
  try {
    const { 'cnpj-sh': cnpjSh, 'token-sh': tokenSh } = req.headers;

    if (cnpjSh && tokenSh) {
      if (!isValidCNPJFormat(cnpjSh)) {
        return res.status(400).json({
          success: false,
          error: 'Formato de CNPJ inválido. Use: XX.XXX.XXX/XXXX-XX',
          code: 'INVALID_CNPJ_FORMAT',
          field: 'cnpj-sh'
        });
      }

      if (!isValidTokenSHFormat(tokenSh)) {
        return res.status(400).json({
          success: false,
          error: 'Formato de token-sh inválido',
          code: 'INVALID_TOKEN_SH_FORMAT',
          field: 'token-sh'
        });
      }

      const softwareHouse = await AuthenticationService.validateSoftwareHouseByToken(tokenSh);
      
      if (softwareHouse && softwareHouse.cnpj === cnpjSh) {
        req.softwareHouse = {
          id: softwareHouse.id,
          cnpj: softwareHouse.cnpj,
          razao_social: softwareHouse.razao_social,
          nome_fantasia: softwareHouse.nome_fantasia,
          email: softwareHouse.email,
          token_sh: softwareHouse.token_sh,
          ativo: softwareHouse.ativo
        };
      }
    }

    next();
  } catch (error) {
    console.error('Erro na validação opcional de headers:', error);
    next();
  }
};

/**
 * Middleware para validar apenas o CNPJ
 */
const validateCNPJHeader = (req, res, next) => {
  const { 'cnpj-sh': cnpjSh } = req.headers;

  if (!cnpjSh) {
    return res.status(400).json({
      success: false,
      error: 'Header cnpj-sh é obrigatório',
      code: 'MISSING_CNPJ_SH_HEADER',
      field: 'cnpj-sh'
    });
  }

  if (!isValidCNPJFormat(cnpjSh)) {
    return res.status(400).json({
      success: false,
      error: 'Formato de CNPJ inválido. Use: XX.XXX.XXX/XXXX-XX',
      code: 'INVALID_CNPJ_FORMAT',
      field: 'cnpj-sh'
    });
  }

  next();
};

/**
 * Middleware para validar apenas o token SH
 */
const validateTokenSHHeader = async (req, res, next) => {
  try {
    const { 'token-sh': tokenSh } = req.headers;

    if (!tokenSh) {
      return res.status(400).json({
        success: false,
        error: 'Header token-sh é obrigatório',
        code: 'MISSING_TOKEN_SH_HEADER',
        field: 'token-sh'
      });
    }

    if (!isValidTokenSHFormat(tokenSh)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de token-sh inválido',
        code: 'INVALID_TOKEN_SH_FORMAT',
        field: 'token-sh'
      });
    }

    const softwareHouse = await AuthenticationService.validateSoftwareHouseByToken(tokenSh);
    
    if (!softwareHouse) {
      return res.status(401).json({
        success: false,
        error: 'Token SH inválido ou Software House inativa',
        code: 'INVALID_TOKEN_SH'
      });
    }

    req.softwareHouse = {
      id: softwareHouse.id,
      cnpj: softwareHouse.cnpj,
      razao_social: softwareHouse.razao_social,
      nome_fantasia: softwareHouse.nome_fantasia,
      email: softwareHouse.email,
      token_sh: softwareHouse.token_sh,
      ativo: softwareHouse.ativo
    };

    next();
  } catch (error) {
    console.error('Erro na validação do token SH:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno na validação do token SH',
      code: 'TOKEN_SH_VALIDATION_ERROR'
    });
  }
};

/**
 * Valida o formato do CNPJ
 */
function isValidCNPJFormat(cnpj) {
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return cnpjRegex.test(cnpj);
}

/**
 * Valida o formato do token SH
 */
function isValidTokenSHFormat(tokenSh) {
  const tokenRegex = /^[A-Za-z0-9]{32}$/;
  return tokenRegex.test(tokenSh);
}

/**
 * Middleware para validar headers de rate limiting
 */
const validateRateLimitHeaders = (req, res, next) => {
  const { 'x-rate-limit-key': rateLimitKey } = req.headers;

  if (rateLimitKey) {
    req.rateLimitKey = rateLimitKey;
  }

  next();
};

/**
 * Middleware para validar headers de correlação
 */
const validateCorrelationHeaders = (req, res, next) => {
  const { 'x-correlation-id': correlationId } = req.headers;

  if (correlationId) {
    req.correlationId = correlationId;
  } else {
    req.correlationId = generateCorrelationId();
  }

  res.setHeader('x-correlation-id', req.correlationId);

  next();
};

/**
 * Gera um ID de correlação único
 */
function generateCorrelationId() {
  return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Middleware para validar query de protocolos (start_date / end_date)
 * - exige start_date quando end_date for fornecido
 * - valida formato ISO
 * - limita intervalo máximo a 31 dias
 * Retorna { error: "mensagem" } com status 400 conforme os testes esperam
 */
const protocoloQuerySchema = Joi.object({
  start_date: Joi.date().iso().when('end_date', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  end_date: Joi.date().iso()
});

async function validateProtocolQuery(req, res, next) {
  try {
    // console.log para debug local se necessário
    // console.log('validateProtocolQuery', req.query);

    const { error, value } = protocoloQuerySchema.validate(req.query, { convert: true, abortEarly: false });
    if (error) {
      const message = error.details.map(d => d.message).join(', ');
      return res.status(400).json({ error: message });
    }

    if (value.start_date && value.end_date) {
      const start = new Date(value.start_date);
      const end = new Date(value.end_date);
      const diffDays = Math.floor((end - start) / (1000 * 60 * 60 * 24));
      if (diffDays > 31) {
        return res.status(400).json({ error: "O intervalo entre as datas não pode exceder 31 dias" });
      }
      if (diffDays < 0) {
        return res.status(400).json({ error: "end_date deve ser maior ou igual a start_date" });
      }
    }

    req.query = { ...req.query, ...value };
    return next();
  } catch (err) {
    console.error('validateProtocolQuery error', err);
    return res.status(500).json({ error: 'Erro interno na validação de query' });
  }
}

module.exports = {
  validateRequiredHeaders,
  validateOptionalHeaders,
  validateCNPJHeader,
  validateTokenSHHeader,
  validateRateLimitHeaders,
  validateCorrelationHeaders,
  validateProtocolQuery
};
