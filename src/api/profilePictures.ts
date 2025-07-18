// src/api/profilePictures.ts
import apiClient from '@/utils/apiClient';

export const uploadProfilePicture = async (
  employeeId: number,
  file: File
): Promise<string> => {
  const formData = new FormData();
  formData.append('profilePicture', file);

  const response = await apiClient.post(
    `/employees/${employeeId}/profile-picture`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
};

export const deleteProfilePicture = async (
  employeeId: number
): Promise<void> => {
  await apiClient.delete(`/employees/${employeeId}/profile-picture`);
};

export const getProfilePictureUrl = (employeeId: number): string => {
  return `${import.meta.env.VITE_API_BASE_URL || ''}/employees/${employeeId}/profile-picture?t=${Date.now()}`;
};

export const getProfilePictureThumbnailUrl = (employeeId: number): string => {
  return `${import.meta.env.VITE_API_BASE_URL || ''}/employees/${employeeId}/profile-picture/thumbnail?t=${Date.now()}`;
};

export const getProfilePictureBlob = async (employeeId: number): Promise<Blob> => {
  const response = await apiClient.get(
    `/employees/${employeeId}/profile-picture`,
    { responseType: 'blob' }
  );
  return response.data;
};