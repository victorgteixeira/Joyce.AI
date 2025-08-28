// AuthContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// ⬇️ troque axios cru pela instância
import api from '../services/api'; // ajuste o caminho se não usar alias "@"
                                     // ex: '../../services/api'

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (stored) {
        try {
          // injeta o token na instância api (se o usuário recarregar a página)
          api.defaults.headers.common.Authorization = `Bearer ${stored}`;
          setToken(stored);

          // Buscar perfil real do usuário
          const { data } = await api.get<User>('/auth/me');
          setUser(data);
        } catch (err: any) {
          console.error('Error fetching user profile:', err);
          
          // Se o erro for 401 e temos refresh token, deixa o interceptor tentar
          if (err?.response?.status === 401 && refreshToken) {
            // O interceptor vai tentar fazer refresh automaticamente
            // Se falhar, vai limpar os tokens
            setUser(null);
          } else {
            // Para outros erros, limpa tudo
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            delete api.defaults.headers.common.Authorization;
            setToken(null);
            setUser(null);
          }
        }
      }
      
      setLoading(false);
    };
    init();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // ⬇️ usa a instância api (vai para http://localhost:3000/auth/login)
      const { data } = await api.post('/auth/login', { email, password });

      const { accessToken, refreshToken, user: me } = data;

      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setToken(accessToken);
      setUser(me);

      // injeta para as próximas chamadas
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.post('/auth/register', { email, password });
      await login(email, password);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common.Authorization;
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isLoading: loading, error, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Removendo a exportação padrão, pois já estamos usando exportações nomeadas
