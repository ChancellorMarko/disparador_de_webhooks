const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Servico = sequelize.define(
    "Servico",
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
      convenio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "convenios",
          key: "id",
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["REGISTRADO", "LIQUIDADO", "BAIXADO", "ativo", "inativo"]],
        },
      },
    },
    {
      tableName: "servicos",
      underscored: true,
      timestamps: true,
    }
  );

  Servico.associate = (models) => {
    Servico.belongsTo(models.Convenio, {
      foreignKey: "convenio_id",
      as: "convenio",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Servico;
};