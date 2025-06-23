import apiClient from '@/utils/apiClient';
import {
  Employee,
  EmployeeDTO,
  EmployeeUpdateDTO,
  EmployeeStatusUpdateDTO,
  EmployeeProfileDTO,
  EmployeeStatusHistoryDTO,
} from '@/types';

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await apiClient.get('/employees');
  return response.data;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
  const response = await apiClient.get(`/employees/${id}`);
  return response.data;
};

export const getEmployeeProfile = async (): Promise<EmployeeProfileDTO> => {
  const response = await apiClient.get('/profile');
  return response.data;
};

export const createEmployee = async (
  employee: EmployeeDTO,
  profilePicture?: File,
  document?: File
): Promise<Employee> => {
  const formData = new FormData();
  formData.append(
    'employee',
    new Blob([JSON.stringify(employee)], {
      type: 'application/json',
    })
  );
  if (profilePicture) formData.append('profilePicture', profilePicture);
  if (document) formData.append('document', document);

  const response = await apiClient.post('/employees', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateEmployee = async (
  id: number,
  employee: EmployeeUpdateDTO,
  profilePicture?: File,
  document?: File
): Promise<Employee> => {
  const formData = new FormData();
  formData.append(
    'employee',
    new Blob([JSON.stringify(employee)], {
      type: 'application/json',
    })
  );
  if (profilePicture) formData.append('profilePicture', profilePicture);
  if (document) formData.append('document', document);

  const response = await apiClient.put(`/employees/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateEmployeeStatus = async (
  id: number,
  statusUpdate: EmployeeStatusUpdateDTO
): Promise<Employee> => {
  const response = await apiClient.put(`/employees/${id}/status`, statusUpdate);
  return response.data;
};

export const updateEmployeeProfilePicture = async (
  id: number,
  file: File
): Promise<Employee> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.put(`/employees/${id}/picture`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateOwnProfilePicture = async (
  file: File
): Promise<EmployeeProfileDTO> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.put('/profile/picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await apiClient.delete(`/employees/${id}`);
};

export const getEmployeeStatusHistory = async (
  id: number
): Promise<EmployeeStatusHistoryDTO[]> => {
  const response = await apiClient.get(`/employees/${id}/status-history`);
  return response.data;
};
