const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Conta = sequelize.define(
    "Conta",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      data_criacao: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      produto: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["boleto", "pagamento", "pix"]],
        },
      },
      banco_codigo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cedente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "cedentes",
          key: "id",
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "ativo",
        validate: {
          isIn: [["ativo", "inativo"]],
        },
      },
      configuracao_notificacao: {
        type: DataTypes.JSONB, // PostgreSQL
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      tableName: "contas",
      underscored: true,
      timestamps: false,
    },
  )

  Conta.associate = (models) => {
    Conta.belongsTo(models.Cedente, {
      foreignKey: "cedente_id",
      as: "cedente",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })

    Conta.hasMany(models.Convenio, {
      foreignKey: "conta_id",
      as: "convenios",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
  }

  return Conta
}
