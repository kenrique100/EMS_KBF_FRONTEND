import apiClient from '@/config/apiClient';
import { FileUploadResponse } from '@/types';

export const uploadFile = async (file: File, subDirectory: string): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post(`/employees/files?subDirectory=${subDirectory}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const downloadFile = async (filename: string, subDirectory: string): Promise<Blob> => {
  const response = await apiClient.get(`/employees/files/${subDirectory}/${filename}`, {
    responseType: 'blob',
  });
  return response.data;
};

export const deleteFile = async (filename: string, subDirectory: string): Promise<void> => {
  await apiClient.delete(`/employees/files/${subDirectory}/${filename}`);
};

export const getFileUrl = (filename: string, subDirectory: string): string => {
  return `/api/employees/files/${subDirectory}/${filename}`;
};