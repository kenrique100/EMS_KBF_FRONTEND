import apiClient from '../utils/apiClient';
import { LoginRequest, LoginResponse, UserResponse } from '@/types';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
};

export const logout = async (): Promise<void> => {
    await apiClient.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<UserResponse> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
};