class createSoftwareHouseService {
  async execute(cnpj, token, status) {
    const jaExisteSoftwareHouse = await SoftwareHouse.findOne({ where: { cnpj } });
    if (jaExisteSoftwareHouse) {
     throw new Error("Software House já cadastrada");
    }
    await SoftwareHouse.create({ cnpj, token, status });
  }
}
