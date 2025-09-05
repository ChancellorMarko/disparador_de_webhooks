import api from './api'; 

// Função para pegar os cedentes
export const getCedentes = async () => {
  try {
    const response = await api.get('/cedentes'); // Chama o endpoint do backend
    return response.data; // Retorna os dados
  } catch (error) {
    console.error("Erro ao buscar cedentes:", error);
    throw error; // Pode lançar um erro para ser tratado na página
  }
};