const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Cedente = sequelize.define(
    "Cedente",
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
      cnpj: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true,
        validate: {
          len: [14, 14],
          isNumeric: true,
        },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      softwarehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "software_houses",
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
      tableName: "cedentes",
      underscored: true,
      timestamps: false,
    },
  )

  Cedente.associate = (models) => {
    Cedente.belongsTo(models.SoftwareHouse, {
      foreignKey: "softwarehouse_id",
      as: "softwareHouse",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })

    Cedente.hasMany(models.Conta, {
      foreignKey: "cedente_id",
      as: "contas",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })

    Cedente.hasMany(models.WebhookReprocessado, {
      foreignKey: "cedente_id",
      as: "webhooksReprocessados",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
  }

  return Cedente
}
