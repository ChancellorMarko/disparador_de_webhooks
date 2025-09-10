'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conta = sequelize.define('Conta', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()')
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: false
    },
    agencia: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cedente_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Cedente',
        key: 'id'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.fn('NOW')
    }
  }, {
    tableName: 'contas',
    underscored: true,
    timestamps: false
  });

  Conta.associate = function(models) {
    Conta.belongsTo(models.Cedente, {
      foreignKey: 'cedente_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Conta;
};



