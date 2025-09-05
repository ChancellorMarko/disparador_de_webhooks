import api from './api'; 


export const getConvenios = async () => {
  try {
    const response = await api.get('/convenios'); 
    return response.data; 
  } catch (error) {
    console.error("Erro ao buscar convenios:", error);
    throw error; 
  }
};