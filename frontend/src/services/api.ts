import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

// helper para ler/gravar tokens
function getAccessToken() {
  return localStorage.getItem('token');
}
function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}
function setAccessToken(token: string) {
  localStorage.setItem('token', token);
  // opcional: injeta nas defaults também
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}
function clearTokens() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
  // se usar cookies httpOnly no backend, ative:
  // withCredentials: true,
});

// --- REQUEST: injeta Bearer em todas as requisições
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag TS para evitar loop de refresh
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Variável para controlar se já estamos fazendo refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// --- RESPONSE: tenta refresh no 401 uma vez
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = (error.config || {}) as RetryConfig;

    // Se 401 e ainda não tentamos refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já estamos fazendo refresh, adiciona à fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (token) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
          return Promise.reject(error);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        processQueue(error, null);
        isRefreshing = false;
        return Promise.reject(error);
      }

      try {
        // Cria uma nova instância axios para evitar interceptors
        const refreshApi = axios.create({
          baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
          headers: { 'Content-Type': 'application/json' },
        });
        
        const { data } = await refreshApi.post('/auth/refresh', { refreshToken });
        const accessToken = data?.accessToken as string;

        if (!accessToken) throw new Error('No accessToken on refresh response');

        setAccessToken(accessToken);
        
        // Atualiza também o refreshToken se retornado
        if (data?.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        processQueue(null, accessToken);
        isRefreshing = false;

        // reenvia a requisição original com o novo token
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (e) {
        processQueue(e, null);
        clearTokens();
        isRefreshing = false;
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
