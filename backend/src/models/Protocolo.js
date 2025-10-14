const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Protocolo = sequelize.define(
    "Protocolo",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      protocolo: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      cedente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "cedentes", key: "id" },
      },
      conta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "contas", key: "id" },
      },
      convenio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "convenios", key: "id" },
      },
      servico_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "servicos", key: "id" },
      },
      software_house_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "software_houses", key: "id" },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pendente",
        validate: {
          isIn: [["pendente", "processando", "sucesso", "erro", "cancelado"]],
        },
      },
      tentativas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      dados_requisicao: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      dados_resposta: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      erro_mensagem: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      processado_em: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "protocolos",
      underscored: true,
      timestamps: true,
    },
  )

  Protocolo.associate = (models) => {
    Protocolo.belongsTo(models.Cedente, {
      foreignKey: "cedente_id",
      as: "cedente",
    })
    Protocolo.belongsTo(models.Conta, {
      foreignKey: "conta_id",
      as: "conta",
    })
    Protocolo.belongsTo(models.Convenio, {
      foreignKey: "convenio_id",
      as: "convenio",
    })
    Protocolo.belongsTo(models.Servico, {
      foreignKey: "servico_id",
      as: "servico",
    })
    Protocolo.belongsTo(models.SoftwareHouse, {
      foreignKey: "software_house_id",
      as: "softwareHouse",
    })
  }

  return Protocolo
}
