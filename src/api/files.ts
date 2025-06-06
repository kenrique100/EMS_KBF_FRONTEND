import api from '../config/axios';

export const uploadFile = async (
    file: File,
    subDirectory: string
): Promise<{ filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/employees/files/${subDirectory}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const downloadFile = async (
    filename: string,
    subDirectory: string
): Promise<Blob> => {
    const response = await api.get(`/employees/files/${subDirectory}/${filename}`, {
        responseType: 'blob',
    });
    return response.data;
};

export const deleteFile = async (
    filename: string,
    subDirectory: string
): Promise<void> => {
    await api.delete(`/employees/files/${subDirectory}/${filename}`);
};