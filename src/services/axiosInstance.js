import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // URL base da sua API
  timeout: 5000, // Tempo limite para as requisições em milissegundos
});

// Adicione um interceptor para as requisições
axiosInstance.interceptors.request.use((config) => {
  // Adicione o token de autenticação ao cabeçalho de todas as requisições, se estiver disponível
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Adicione um interceptor para as respostas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se a resposta retornar um status de erro 401 (não autorizado), faça alguma ação, como redirecionar para a página de login
    if (error.response.status === 401) {
      // Redirecionar para a página de login ou realizar alguma outra ação
      console.log('Erro 401: Não autorizado');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
