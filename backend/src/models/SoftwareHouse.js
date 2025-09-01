const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const SoftwareHouse = sequelize.define('SoftwareHouse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cnpj: {
    type: DataTypes.STRING(18),
    allowNull: false,
    unique: true,
    validate: {
      isCNPJ(value) {
        // Validação básica de CNPJ (formato XX.XXX.XXX/XXXX-XX)
        const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
        if (!cnpjRegex.test(value)) {
          throw new Error('CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX');
        }
      }
    }
  },
  razao_social: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nome_fantasia: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  token_sh: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  ultimo_acesso: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tentativas_login: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  bloqueado_ate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'software_houses',
  timestamps: true,
  hooks: {
    beforeCreate: async (softwareHouse) => {
      if (softwareHouse.senha) {
        softwareHouse.senha = await bcrypt.hash(softwareHouse.senha, 12);
      }
      if (!softwareHouse.token_sh) {
        softwareHouse.token_sh = generateTokenSH();
      }
    },
    beforeUpdate: async (softwareHouse) => {
      if (softwareHouse.changed('senha')) {
        softwareHouse.senha = await bcrypt.hash(softwareHouse.senha, 12);
      }
    }
  }
});

// Método para verificar senha
SoftwareHouse.prototype.verificarSenha = async function(senha) {
  return await bcrypt.compare(senha, this.senha);
};

// Método para gerar novo token
SoftwareHouse.prototype.gerarNovoToken = function() {
  this.token_sh = generateTokenSH();
  return this.token_sh;
};

// Método para verificar se está bloqueado
SoftwareHouse.prototype.estaBloqueado = function() {
  if (!this.bloqueado_ate) return false;
  return new Date() < this.bloqueado_ate;
};

// Método para incrementar tentativas de login
SoftwareHouse.prototype.incrementarTentativas = function() {
  this.tentativas_login += 1;
  if (this.tentativas_login >= 5) {
    // Bloquear por 30 minutos após 5 tentativas
    this.bloqueado_ate = new Date(Date.now() + 30 * 60 * 1000);
  }
};

// Método para resetar tentativas de login
SoftwareHouse.prototype.resetarTentativas = function() {
  this.tentativas_login = 0;
  this.bloqueado_ate = null;
  this.ultimo_acesso = new Date();
};

// Função para gerar token SH único
function generateTokenSH() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = SoftwareHouse;



