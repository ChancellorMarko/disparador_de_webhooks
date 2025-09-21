class deleteCedenteService{
    async execute(id) {
        const Cedente = await Cedente.findById(id);
        if (!Cedente) {
            throw new Error("Cedente não encontrado");
        }
        await Cedente.delete(id);
    }
}