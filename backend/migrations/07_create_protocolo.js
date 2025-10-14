exports.up = (knex) =>
  knex.schema.createTable("protocolos", (table) => {
    table.increments("id").primary()
    table.uuid("protocolo").notNullable().unique().defaultTo(knex.raw("gen_random_uuid()"))

    table.integer("cedente_id").notNullable().unsigned()
    table.foreign("cedente_id").references("id").inTable("cedentes").onDelete("CASCADE")

    table.integer("conta_id").notNullable().unsigned()
    table.foreign("conta_id").references("id").inTable("contas").onDelete("CASCADE")

    table.integer("convenio_id").notNullable().unsigned()
    table.foreign("convenio_id").references("id").inTable("convenios").onDelete("CASCADE")

    table.integer("servico_id").notNullable().unsigned()
    table.foreign("servico_id").references("id").inTable("servicos").onDelete("CASCADE")

    table.integer("software_house_id").notNullable().unsigned()
    table.foreign("software_house_id").references("id").inTable("software_houses").onDelete("CASCADE")

    table.string("status").notNullable().defaultTo("pendente")
    table.integer("tentativas").notNullable().defaultTo(0)

    table.jsonb("dados_requisicao")
    table.jsonb("dados_resposta")
    table.text("erro_mensagem")

    table.timestamp("processado_em")
    table.timestamps(true, true)

    table.index(["cedente_id", "created_at"])
    table.index(["status", "created_at"])
    table.index("protocolo")
  })

exports.down = (knex) => knex.schema.dropTableIfExists("protocolos")
