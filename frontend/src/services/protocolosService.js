import api from './api'; // Certifique-se de importar o axios configurado

// Função para pegar os protocolos
export const getProtocolos = async () => {
  try {
    const response = await api.get('/protocolos'); // Chama o endpoint do backend
    return response.data; // Retorna os dados
  } catch (error) {
    console.error("Erro ao buscar protocolos:", error);
    throw error; // Lança o erro para ser tratado na página
  }
};