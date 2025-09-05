import api from './api'; 

// Função para pegar os cedentes
export const getCedentes = async () => {
  try {
    const response = await api.get('/cedentes'); 
    return response.data; 
  } catch (error) {
    console.error("Erro ao buscar cedentes:", error);
    throw error; 
  }
};