class findByIdSoftwareHouseService {
  async execute(id) {
    const softwareHouse = await softwareHouse.findById(id);
    if(!softwareHouse) {
      throw new Error("Software House não encontrada");
    }
    return softwareHouse;
  }
}