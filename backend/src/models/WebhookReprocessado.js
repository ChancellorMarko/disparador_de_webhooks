'use strict';
module.exports = (sequelize, DataTypes) => {
  const WebhookReprocessado = sequelize.define('WebhookReprocessado', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
      allowNull: false
    },
    data: {
      type: DataTypes.JSONB, // PostgreSQL
      allowNull: false
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()')
    },
    cedente_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Cedente',
        key: 'id'
      }
    },
    kind: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    servico_id: {
      type: DataTypes.TEXT, // armazenando array de IDs como JSON.stringify()
      allowNull: false
    },
    protocolo: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'webhook_reprocessados',
    underscored: true,
    timestamps: false
  });

  WebhookReprocessado.associate = function(models) {
    WebhookReprocessado.belongsTo(models.Cedente, {
      foreignKey: 'cedente_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return WebhookReprocessado;
};



