const { DataTypes } = require("sequelize");

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
      },
      cnpj: {
        type: DataTypes.STRING(14),
        allowNull: false,
        unique: true,
        validate: { len: [14, 14], isNumeric: true },
      },
      razao_social: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nome_fantasia: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      softwarehouse_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "software_houses", key: "id" },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "ativo",
        validate: { isIn: [["ativo", "inativo", "bloqueado"]] },
      },
      configuracao_notificacao: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "cedentes",
      underscored: true,
      timestamps: true,
    }
  );

  Cedente.associate = (models) => {
    Cedente.belongsTo(models.SoftwareHouse, {
      foreignKey: "softwarehouse_id",
      as: "softwareHouse",
    });
    Cedente.hasMany(models.Conta, { foreignKey: "cedente_id", as: "contas" });
    Cedente.hasMany(models.WebhookReprocessado, {
      foreignKey: "cedente_id",
      as: "webhooksReprocessados",
    });
  };

  return Cedente;
};