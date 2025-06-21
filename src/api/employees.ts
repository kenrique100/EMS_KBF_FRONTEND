import apiClient from '../utils/apiClient';
import { Employee, EmployeeDTO } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: getEmployees,
    staleTime: 5 * 60 * 1000,
  });
};

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await apiClient.get('/employees');
  return response.data;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
  const response = await apiClient.get(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (
  employee: EmployeeDTO,
  profilePicture?: File,
  document?: File
): Promise<Employee> => {
  const formData = new FormData();

  // Append employee data as JSON
  formData.append('employee', new Blob([JSON.stringify(employee)], {
    type: 'application/json'
  }));

  // Append files if they exist
  if (profilePicture) formData.append('profilePicture', profilePicture);
  if (document) formData.append('document', document);

  const response = await apiClient.post('/employees', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

export const updateEmployee = async (
  id: number,
  employee: EmployeeDTO,
  profilePicture?: File,
  document?: File
): Promise<Employee> => {
  const formData = new FormData();

  // Append employee data as JSON
  formData.append('employee', new Blob([JSON.stringify(employee)], {
    type: 'application/json'
  }));

  // Append files if they exist
  if (profilePicture) formData.append('profilePicture', profilePicture);
  if (document) formData.append('document', document);

  const response = await apiClient.put(`/employees/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await apiClient.delete(`/employees/${id}`);
};

export const getEmployeeProfile = async (): Promise<Employee> => {
  const response = await apiClient.get('/profile');
  return response.data;
};