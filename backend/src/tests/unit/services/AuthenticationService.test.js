const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SoftwareHouse = require('../models/SoftwareHouse');
const { redisClient } = require('../config/redis');

class AuthenticationService {
  /**
   * Autentica uma Software House
   * @param {string} cnpj - CNPJ da Software House
   * @param {string} senha - Senha da Software House
   * @returns {Object} - Objeto com token JWT e informações da Software House
   */
  static async authenticate(cnpj, senha) {
    try {
      // Busca a Software House pelo CNPJ
      const softwareHouse = await SoftwareHouse.findOne({
        where: { cnpj, ativo: true }
      });

      if (!softwareHouse) {
        throw new Error('CNPJ não encontrado ou Software House inativa');
      }

      // Verifica se está bloqueada
      if (softwareHouse.estaBloqueado()) {
        throw new Error('Software House temporariamente bloqueada devido a múltiplas tentativas de login');
      }

      // Verifica a senha
      const senhaValida = await softwareHouse.verificarSenha(senha);
      if (!senhaValida) {
        softwareHouse.incrementarTentativas();
        await softwareHouse.save();
        throw new Error('Senha incorreta');
      }

      // Reset das tentativas de login
      softwareHouse.resetarTentativas();
      await softwareHouse.save();

      // Gera o token JWT
      const token = this.generateToken(softwareHouse);
      const refreshToken = this.generateRefreshToken(softwareHouse);

      // Armazena o refresh token no Redis
      await this.storeRefreshToken(softwareHouse.id, refreshToken);

      return {
        success: true,
        token,
        refreshToken,
        softwareHouse: {
          id: softwareHouse.id,
          cnpj: softwareHouse.cnpj,
          razao_social: softwareHouse.razao_social,
          nome_fantasia: softwareHouse.nome_fantasia,
          email: softwareHouse.email,
          token_sh: softwareHouse.token_sh,
          ultimo_acesso: softwareHouse.ultimo_acesso
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gera um token JWT
   * @param {Object} softwareHouse - Objeto da Software House
   * @returns {string} - Token JWT
   */
  static generateToken(softwareHouse) {
    const payload = {
      id: softwareHouse.id,
      cnpj: softwareHouse.cnpj,
      token_sh: softwareHouse.token_sh,
      type: 'software_house'
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  }

  /**
   * Gera um refresh token
   * @param {Object} softwareHouse - Objeto da Software House
   * @returns {string} - Refresh token
   */
  static generateRefreshToken(softwareHouse) {
    const payload = {
      id: softwareHouse.id,
      cnpj: softwareHouse.cnpj,
      type: 'refresh'
    };

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    });
  }

  /**
   * Valida um token JWT
   * @param {string} token - Token JWT
   * @returns {Object} - Payload decodificado do token
   */
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  /**
   * Valida um refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} - Payload decodificado do refresh token
   */
  static verifyRefreshToken(refreshToken) {
    try {
      return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error('Refresh token inválido ou expirado');
    }
  }

  /**
   * Renova um token JWT usando refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Object} - Novo token JWT
   */
  static async refreshToken(refreshToken) {
    try {
      // Verifica o refresh token
      const payload = this.verifyRefreshToken(refreshToken);
      
      // Verifica se o refresh token está armazenado no Redis
      const storedToken = await this.getRefreshToken(payload.id);
      if (!storedToken || storedToken !== refreshToken) {
        throw new Error('Refresh token não encontrado');
      }

      // Busca a Software House
      const softwareHouse = await SoftwareHouse.findByPk(payload.id);
      if (!softwareHouse || !softwareHouse.ativo) {
        throw new Error('Software House não encontrada ou inativa');
      }

      // Gera novo token
      const newToken = this.generateToken(softwareHouse);
      const newRefreshToken = this.generateRefreshToken(softwareHouse);

      // Atualiza o refresh token no Redis
      await this.storeRefreshToken(softwareHouse.id, newRefreshToken);

      return {
        success: true,
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Armazena um refresh token no Redis
   * @param {number} softwareHouseId - ID da Software House
   * @param {string} refreshToken - Refresh token
   */
  static async storeRefreshToken(softwareHouseId, refreshToken) {
    try {
      const key = `refresh_token:${softwareHouseId}`;
      const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
      
      // Converte para segundos
      const expiresInSeconds = this.parseTimeToSeconds(expiresIn);
      
      await redisClient.setEx(key, expiresInSeconds, refreshToken);
    } catch (error) {
      console.error('Erro ao armazenar refresh token:', error);
    }
  }

  /**
   * Recupera um refresh token do Redis
   * @param {number} softwareHouseId - ID da Software House
   * @returns {string|null} - Refresh token ou null se não encontrado
   */
  static async getRefreshToken(softwareHouseId) {
    try {
      const key = `refresh_token:${softwareHouseId}`;
      return await redisClient.get(key);
    } catch (error) {
      console.error('Erro ao recuperar refresh token:', error);
      return null;
    }
  }

  /**
   * Remove um refresh token do Redis
   * @param {number} softwareHouseId - ID da Software House
   */
  static async removeRefreshToken(softwareHouseId) {
    try {
      const key = `refresh_token:${softwareHouseId}`;
      await redisClient.del(key);
    } catch (error) {
      console.error('Erro ao remover refresh token:', error);
    }
  }

  /**
   * Faz logout de uma Software House
   * @param {number} softwareHouseId - ID da Software House
   */
  static async logout(softwareHouseId) {
    try {
      await this.removeRefreshToken(softwareHouseId);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  /**
   * Converte tempo em formato string para segundos
   * @param {string} timeString - String de tempo (ex: '24h', '7d', '30m')
   * @returns {number} - Tempo em segundos
   */
  static parseTimeToSeconds(timeString) {
    const unit = timeString.slice(-1);
    const value = parseInt(timeString.slice(0, -1));

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: return 24 * 60 * 60; // 24 horas por padrão
    }
  }

  /**
   * Valida se uma Software House está ativa pelo token_sh
   * @param {string} tokenSh - Token SH da Software House
   * @returns {Object|null} - Software House ou null se não encontrada
   */
  static async validateSoftwareHouseByToken(tokenSh) {
    try {
      const softwareHouse = await SoftwareHouse.findOne({
        where: { 
          token_sh: tokenSh,
          ativo: true
        }
      });

      return softwareHouse;
    } catch (error) {
      console.error('Erro ao validar Software House por token:', error);
      return null;
    }
  }
}

module.exports = AuthenticationService;



