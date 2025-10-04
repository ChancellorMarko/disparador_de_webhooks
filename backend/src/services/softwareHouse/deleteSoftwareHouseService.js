class deleteSoftwareHouseService {
  async execute(id) {
    const softwareHouse = await SoftwareHouse.findById(id);
    if (!softwareHouse) {
      throw new Error("Software House não encontrada");
    }
    await SoftwareHouse.delete(id);
    
  }
}