// src/api/employees.ts
import apiClient from '@/utils/apiClient';
import {
  EmployeeDTO,
  EmployeeUpdateDTO,
  EmployeeStatusUpdateDTO,
  EmployeeProfileDTO,
  EmployeeStatusHistoryDTO
} from '@/types';

export const getEmployees = async (): Promise<EmployeeDTO[]> => {
  const response = await apiClient.get('/employees');
  return response.data;
};

export const getEmployeeById = async (id: number): Promise<EmployeeDTO> => {
  const response = await apiClient.get(`/employees/${id}`);
  return response.data;
};

export const getEmployeeProfile = async (id: number): Promise<EmployeeProfileDTO> => {
  const response = await apiClient.get(`/employees/profile/${id}`);
  return response.data;
};

export const getOwnProfile = async (): Promise<EmployeeProfileDTO> => {
  const response = await apiClient.get('/profile');
  return response.data;
};

export const createEmployee = async (employee: EmployeeDTO): Promise<EmployeeDTO> => {
  const response = await apiClient.post('/employees', employee);
  return response.data;
};

export const updateEmployee = async (
  id: number,
  employee: EmployeeUpdateDTO
): Promise<EmployeeDTO> => {
  const response = await apiClient.put(`/employees/${id}`, employee);
  return response.data;
};

export const updateEmployeeStatus = async (
  id: number,
  statusUpdate: EmployeeStatusUpdateDTO
): Promise<EmployeeDTO> => {
  const response = await apiClient.put(`/employees/status/${id}`, statusUpdate);
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await apiClient.delete(`/employees/${id}`);
};

export const getEmployeeStatusHistory = async (
  id: number
): Promise<EmployeeStatusHistoryDTO[]> => {
  const response = await apiClient.get(`/employees/history/status/${id}`);
  return response.data;
};

export const updateEmployeeProfilePicture = async (
  id: number,
  file: File
): Promise<EmployeeDTO> => {
  const formData = new FormData();
  formData.append('profilePicture', file);

  const response = await apiClient.put(
    `/profile-pictures/${id}/profile-picture`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  return response.data;
};