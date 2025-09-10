'use strict';
module.exports = (sequelize, DataTypes) => {
  const Convenio = sequelize.define('Convenio', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('NOW()'),
      allowNull: false
    }
  }, {
    tableName: 'convenios',
    underscored: true,
    timestamps: false
  });

  Convenio.associate = function(models) {
    Convenio.hasMany(models.Servico, {
      foreignKey: 'convenio_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Convenio;
};



