import { FileUploadResponse } from '@/types';
import apiClient from '@/config/apiClient';

export const uploadFile = async (file: File, subDirectory: string): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/api/employees/files/${subDirectory}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const downloadFile = async (filename: string, subDirectory: string): Promise<Blob> => {
    const response = await apiClient.get(`/api/employees/files/${subDirectory}/${filename}`, {
        responseType: 'blob',
    });
    return response.data;
};

export const deleteFile = async (filename: string, subDirectory: string): Promise<void> => {
    await apiClient.delete(`/api/employees/files/${subDirectory}/${filename}`);
};