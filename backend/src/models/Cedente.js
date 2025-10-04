'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cedente = sequelize.define('Cedente', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()')
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    tableName: 'cedentes',
    underscored: true,
    timestamps: false
  });

  Cedente.associate = function(models) {
    Cedente.hasMany(models.Conta, {
      foreignKey: 'cedente_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Cedente.hasMany(models.WebhookReprocessado, {
      foreignKey: 'cedente_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Cedente;
};




