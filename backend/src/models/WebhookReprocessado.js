const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const WebhookReprocessado = sequelize.define(
        "WebhookReprocessado",
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            data: {
                type: DataTypes.JSONB,
                allowNull: false,
                comment: "Dados originais da requisição de reenvio (JSON completo)",
            },
            data_criacao: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            cedente_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "cedentes",
                    key: "id",
                },
            },
            kind: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["webhook", "evento", "agendamento"]],
                },
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [["disponivel", "cancelado", "pago"]],
                },
            },
            servico_id: {
                type: DataTypes.TEXT,
                allowNull: false,
                comment: "Array de IDs dos serviços armazenado como JSON.stringify()",
            },
            protocolo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: "webhook_reprocessados",
            underscored: true,

            // >>> A CORREÇÃO ESTÁ AQUI <<<
            timestamps: true, // Alterado de 'false' para 'true'
        },
    )

    WebhookReprocessado.associate = (models) => {
        WebhookReprocessado.belongsTo(models.Cedente, {
            foreignKey: "cedente_id",
            as: "cedente",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        })
    }

    return WebhookReprocessado
}