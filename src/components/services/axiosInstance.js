import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://siteprotoon.azurewebsites.net/', 
  // baseURL: 'http://localhost:8080/',
  timeout: 5000, // tempo limite de 5 segundos para todas as solicitações
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar um interceptor para tratar erros de resposta
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // O servidor respondeu com um status de erro (por exemplo, 400, 500)
      console.error('Erro de resposta:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // A solicitação foi feita, mas não recebeu resposta
      console.error('Erro de solicitação:', error.request);
      return Promise.reject('Não foi possível obter resposta do servidor.');
    } else {
      // Um erro ocorreu ao configurar a solicitação
      console.error('Erro ao configurar a solicitação:', error.message);
      return Promise.reject('Ocorreu um erro ao enviar a solicitação.');
    }
  }
);

export default axiosInstance;
