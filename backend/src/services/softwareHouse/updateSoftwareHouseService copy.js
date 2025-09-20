class updateSoftwareHouseService {
  async execute(id, cnpj, token, status) {
    const softwareHouse = await SoftwareHouse.findById(id);
    if (!softwareHouse) {
      throw new Error("Software House não encontrada");
    }
      const jaExisteSoftwareHouse = await SoftwareHouse.findOne({ where: { cnpj } });
      if (jaExisteSoftwareHouse) {
        throw new Error("CNPJ já cadastrado");
      }
    await SoftwareHouse.update(id, { cnpj, token, status });
    
  }
}