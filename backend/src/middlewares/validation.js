const AuthenticationService = require('../services/AuthenticationService');

/**
 * Middleware para validar headers obrigatórios
 * Verifica se os headers cnpj-sh e token-sh estão presentes e válidos
 */
const validateRequiredHeaders = async (req, res, next) => {
  try {
    const { 'cnpj-sh': cnpjSh, 'token-sh': tokenSh } = req.headers;

    // Verifica se os headers obrigatórios estão presentes
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

    // Valida o formato do CNPJ
    if (!isValidCNPJFormat(cnpjSh)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de CNPJ inválido. Use: XX.XXX.XXX/XXXX-XX',
        code: 'INVALID_CNPJ_FORMAT',
        field: 'cnpj-sh'
      });
    }

    // Valida o formato do token SH
    if (!isValidTokenSHFormat(tokenSh)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de token-sh inválido',
        code: 'INVALID_TOKEN_SH_FORMAT',
        field: 'token-sh'
      });
    }

    // Verifica se a Software House existe e está ativa no banco
    const softwareHouse = await AuthenticationService.validateSoftwareHouseByToken(tokenSh);
    
    if (!softwareHouse) {
      return res.status(401).json({
        success: false,
        error: 'Token SH inválido ou Software House inativa',
        code: 'INVALID_TOKEN_SH'
      });
    }

    // Verifica se o CNPJ do header corresponde ao CNPJ da Software House
    if (softwareHouse.cnpj !== cnpjSh) {
      return res.status(403).json({
        success: false,
        error: 'CNPJ não corresponde ao token SH fornecido',
        code: 'CNPJ_TOKEN_MISMATCH'
      });
    }

    // Adiciona a Software House validada ao request para uso posterior
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
 * Similar ao validateRequiredHeaders, mas não falha se os headers não estiverem presentes
 */
const validateOptionalHeaders = async (req, res, next) => {
  try {
    const { 'cnpj-sh': cnpjSh, 'token-sh': tokenSh } = req.headers;

    // Se ambos os headers estiverem presentes, valida-os
    if (cnpjSh && tokenSh) {
      // Valida o formato do CNPJ
      if (!isValidCNPJFormat(cnpjSh)) {
        return res.status(400).json({
          success: false,
          error: 'Formato de CNPJ inválido. Use: XX.XXX.XXX/XXXX-XX',
          code: 'INVALID_CNPJ_FORMAT',
          field: 'cnpj-sh'
        });
      }

      // Valida o formato do token SH
      if (!isValidTokenSHFormat(tokenSh)) {
        return res.status(400).json({
          success: false,
          error: 'Formato de token-sh inválido',
          code: 'INVALID_TOKEN_SH_FORMAT',
          field: 'token-sh'
        });
      }

      // Verifica se a Software House existe e está ativa
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
    // Em caso de erro, continua sem validação
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

    // Verifica se a Software House existe e está ativa
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
 * @param {string} cnpj - CNPJ a ser validado
 * @returns {boolean} - true se o formato for válido
 */
function isValidCNPJFormat(cnpj) {
  // Regex para formato XX.XXX.XXX/XXXX-XX
  const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return cnpjRegex.test(cnpj);
}

/**
 * Valida o formato do token SH
 * @param {string} tokenSh - Token SH a ser validado
 * @returns {boolean} - true se o formato for válido
 */
function isValidTokenSHFormat(tokenSh) {
  // Token SH deve ter 32 caracteres alfanuméricos
  const tokenRegex = /^[A-Za-z0-9]{32}$/;
  return tokenRegex.test(tokenSh);
}

/**
 * Middleware para validar headers de rate limiting
 */
const validateRateLimitHeaders = (req, res, next) => {
  const { 'x-rate-limit-key': rateLimitKey } = req.headers;

  if (rateLimitKey) {
    // Adiciona a chave de rate limiting ao request
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
    // Gera um ID de correlação se não fornecido
    req.correlationId = generateCorrelationId();
  }

  // Adiciona o ID de correlação ao response header
  res.setHeader('x-correlation-id', req.correlationId);

  next();
};

/**
 * Gera um ID de correlação único
 * @returns {string} - ID de correlação
 */
function generateCorrelationId() {
  return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

module.exports = {
  validateRequiredHeaders,
  validateOptionalHeaders,
  validateCNPJHeader,
  validateTokenSHHeader,
  validateRateLimitHeaders,
  validateCorrelationHeaders
};



