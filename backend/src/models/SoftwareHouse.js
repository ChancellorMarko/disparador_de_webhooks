const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SoftwareHouse = sequelize.define(
    "SoftwareHouse",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "ativo",
        validate: { isIn: [["ativo", "inativo", "bloqueado"]] },
      },
    },
    {
      tableName: "software_houses",
      underscored: true,
      timestamps: true,
    }
  );

  SoftwareHouse.associate = (models) => {
    SoftwareHouse.hasMany(models.Cedente, {
      foreignKey: "softwarehouse_id",
      as: "cedentes",
    });
  };

  return SoftwareHouse;
};
