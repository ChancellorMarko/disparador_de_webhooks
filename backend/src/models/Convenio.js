const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Convenio = sequelize.define(
    "Convenio",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      numero_convenio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data_criacao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      conta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "contas",
          key: "id",
        },
      },
    },
    {
      tableName: "convenios",
      underscored: true,
      
      // >>> A CORREÇÃO ESTÁ AQUI <<<
      timestamps: true, // Alterado de 'false' para 'true'
    },
  )

  Convenio.associate = (models) => {
    Convenio.belongsTo(models.Conta, {
      foreignKey: "conta_id",
      as: "conta",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })

    Convenio.hasMany(models.Servico, {
      foreignKey: "convenio_id",
      as: "servicos",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
  }

  return Convenio
}