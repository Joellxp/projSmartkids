import axios from 'axios';

let showNotification = null;

// Função para registrar o disparador de notificação
export function registerNotification(fn) {
  showNotification = fn;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001'
});

// Interceptor de requisição: adiciona token
axiosInstance.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');
  if (token && (config.url !== '/login' || config.url !== '')) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta: detecta 401 e redireciona
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;

    // Se for rota de login, não intercepta
    if (originalRequest.url.includes('/login')) {
      return Promise.reject(error);
    }
    
    if (error.response && error.response.status === 401) {
      if (showNotification) {
        showNotification("Sessão expirada. Faça login novamente.");
      }
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;