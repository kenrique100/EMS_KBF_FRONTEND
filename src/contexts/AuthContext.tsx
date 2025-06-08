import { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNotification } from '@/contexts/NotificationContext';
import { refreshToken } from '@/api/auth';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showNotification } = useNotification();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const refresh = localStorage.getItem('refreshToken');

      if (token && refresh) {
        try {
          // Verify token isn't expired
          const decoded = jwtDecode<{ exp: number; user: User }>(token);
          if (decoded.exp * 1000 < Date.now()) {
            // Token expired, try to refresh
            try {
              const { accessToken, user } = await refreshToken(refresh);
              localStorage.setItem('accessToken', accessToken);
              setUser(user);
            } catch (refreshError) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          } else {
            setUser(decoded.user);
          }
        } catch (error) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User, accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
    showNotification('Login successful', 'success');
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    showNotification('Logged out successfully', 'info');
  };

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    login,
    logout,
  }), [user, isLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};