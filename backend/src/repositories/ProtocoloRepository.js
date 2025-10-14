const db = require("../models")

class ProtocoloRepository {
  async create(data) {
    return await db.Protocolo.create(data)
  }

  async findById(id) {
    return await db.Protocolo.findByPk(id, {
      include: [
        { model: db.Cedente, as: "cedente" },
        { model: db.Conta, as: "conta" },
        { model: db.Convenio, as: "convenio" },
        { model: db.Servico, as: "servico" },
        { model: db.SoftwareHouse, as: "softwareHouse" },
      ],
    })
  }

  async findAll(filters = {}) {
    const { page = 1, limit = 10, ...where } = filters
    const offset = (page - 1) * limit

    return await db.Protocolo.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: db.Cedente, as: "cedente" },
        { model: db.Conta, as: "conta" },
        { model: db.Convenio, as: "convenio" },
        { model: db.Servico, as: "servico" },
        { model: db.SoftwareHouse, as: "softwareHouse" },
      ],
      order: [["created_at", "DESC"]],
    })
  }

  async update(id, data) {
    const protocolo = await db.Protocolo.findByPk(id)
    if (!protocolo) return null
    return await protocolo.update(data)
  }

  async delete(id) {
    const protocolo = await db.Protocolo.findByPk(id)
    if (!protocolo) return null
    await protocolo.destroy()
    return true
  }
}

module.exports = new ProtocoloRepository()
