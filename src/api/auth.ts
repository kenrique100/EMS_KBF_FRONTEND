import { LoginRequest, LoginResponse, TokenRefreshResponse, UserResponse } from '@/types';
import apiClient from '@/utils/apiClient';

export const apiLogin = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials, {
        skipAuthRefresh: true
    });
    return response.data;
};

export const apiLogout = async (): Promise<void> => {
    await apiClient.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/auth/me');
    return response.data;
};

export const apiRefreshToken = async (refreshToken: string): Promise<TokenRefreshResponse> => {
    const response = await apiClient.post<TokenRefreshResponse>(
      '/auth/refresh',
      { refreshToken },
      { skipAuthRefresh: true }
    );
    return response.data;
};