import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, setAuthToken, clearAuthToken } from '@/utils/auth';
import { jwtDecode } from 'jwt-decode';

type AuthContextType = {
    user: { username: string } | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
    children: ReactNode;
};

// Simulated login API
const loginApi = async (username: string, password: string): Promise<{ accessToken: string }> => {
    // Replace this with real API call
    return Promise.resolve({
        accessToken: 'fake-jwt-token', // Should include valid JWT for real use
    });
};

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = getAuthToken();
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                setUser({ username: decoded.sub });
                setIsAuthenticated(true);
                setIsAdmin(decoded.roles?.includes('ROLE_ADMIN') || false);
            } catch (error) {
                clearAuthToken();
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        const { accessToken } = await loginApi(username, password);
        setAuthToken(accessToken);
        const decoded: any = jwtDecode(accessToken);
        setUser({ username: decoded.sub });
        setIsAuthenticated(true);
        setIsAdmin(decoded.roles?.includes('ROLE_ADMIN') || false);
    };

    const logout = () => {
        clearAuthToken();
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
