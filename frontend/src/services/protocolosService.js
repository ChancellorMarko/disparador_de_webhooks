import api from './api'; 


export const getProtocolos = async () => {
  try {
    const response = await api.get('/protocolos'); 
    return response.data; 
  } catch (error) {
    console.error("Erro ao buscar protocolos:", error);
    throw error; 
  }
};