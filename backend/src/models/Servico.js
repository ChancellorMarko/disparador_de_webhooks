'use strict';
module.exports = (sequelize, DataTypes) => {
  const Servico = sequelize.define('Servico', {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
      allowNull: false
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('NOW()')
    },
    convenio_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Convenio',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'servicos',
    underscored: true,
    timestamps: false
  });

  Servico.associate = function(models) {
    Servico.belongsTo(models.Convenio, {
      foreignKey: 'convenio_id',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };

  return Servico;
};



