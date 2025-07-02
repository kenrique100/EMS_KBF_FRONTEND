// src/api/profilePictures.ts
import apiClient from '@/utils/apiClient';

export const uploadProfilePicture = async (
  employeeId: number,
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append('profilePicture', file);

  const response = await apiClient.post(
    `/profile-pictures/${employeeId}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return response.data;
};

export const removeProfilePicture = async (employeeId: number): Promise<void> => {
  await apiClient.delete(`/profile-pictures/${employeeId}`);
};

export const getProfilePicture = async (employeeId: number): Promise<string> => {
  const response = await apiClient.get(`/profile-pictures/${employeeId}`, {
    responseType: 'blob'
  });
  return URL.createObjectURL(response.data);
};

export const getProfilePictureThumbnail = async (employeeId: number): Promise<string> => {
  const response = await apiClient.get(`/profile-pictures/${employeeId}/thumbnail`, {
    responseType: 'blob'
  });
  return URL.createObjectURL(response.data);
};