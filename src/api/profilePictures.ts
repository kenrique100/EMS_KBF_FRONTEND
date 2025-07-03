// src/api/profilePictures.ts
import apiClient from '@/utils/apiClient';

export const getProfilePictureUrl = (employeeId: number): string => {
  return `/profile-pictures/${employeeId}?t=${Date.now()}`; // Cache busting
};

export const getProfilePictureThumbnailUrl = (employeeId: number): string => {
  return `/profile-pictures/${employeeId}/thumbnail?t=${Date.now()}`;
};

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

export const getProfilePicture = async (employeeId: number): Promise<string> => {
  try {
    const response = await apiClient.get(`/profile-pictures/${employeeId}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    return '';
  }
};

export const deleteProfilePicture = async (
  employeeId: number
): Promise<void> => {
  await apiClient.delete(`/profile-pictures/${employeeId}`);
};