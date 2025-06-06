import api from '../config/axios';

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
};

export const logout = async (): Promise<void> => {
    // Call logout endpoint if your backend has one
    return Promise.resolve();
};