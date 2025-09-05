import api from './api'; // Certifique-se de importar o axios configurado

// Função para pegar os convenios
export const getConvenios = async () => {
  try {
    const response = await api.get('/convenios'); // Chama o endpoint do backend
    return response.data; // Retorna os dados
  } catch (error) {
    console.error("Erro ao buscar convenios:", error);
    throw error; // Lança o erro para ser tratado na página
  }
};