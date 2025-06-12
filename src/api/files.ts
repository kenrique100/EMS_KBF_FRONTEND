// src/api/files.ts
import api from '@/config/axios';
import { FileUploadResponse } from '@/utils/types';

export const uploadFile = async (file: File, subDirectory: string): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/api/employees/files/${subDirectory}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const downloadFile = async (filename: string, subDirectory: string): Promise<Blob> => {
    const response = await api.get(`/api/employees/files/${subDirectory}/${filename}`, {
        responseType: 'blob',
    });
    return response.data;
};

export const deleteFile = async (filename: string, subDirectory: string): Promise<void> => {
    await api.delete(`/api/employees/files/${subDirectory}/${filename}`);
};