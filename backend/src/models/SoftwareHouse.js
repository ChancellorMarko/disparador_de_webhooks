const { DataTypes } = require("sequelize")

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
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "ativo",
        validate: {
          isIn: [["ativo", "inativo"]],
        },
      },
    },
    {
      tableName: "software_houses",
      underscored: true,
      timestamps: false,
    },
  )

  SoftwareHouse.associate = (models) => {
    SoftwareHouse.hasMany(models.Cedente, {
      foreignKey: "softwarehouse_id",
      as: "cedentes",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    })
  }

  return SoftwareHouse
}
