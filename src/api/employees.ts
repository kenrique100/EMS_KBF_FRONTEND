import { Employee, EmployeeFormData, EmployeeUpdateDTO } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/config/apiClient';

const buildEmployeeFormData = (formData: EmployeeFormData | EmployeeUpdateDTO): FormData => {
  const form = new FormData();

  const employeeData = {
    username: formData.username,
    name: formData.name,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    department: formData.department,
    ...('password' in formData && { password: formData.password }),
    dateOfEmployment: formData.dateOfEmployment?.toISOString(),
    ...('status' in formData && { status: formData.status }),
  };

  form.append('employee', JSON.stringify(employeeData));

  if (formData.profilePictureFile instanceof File) {
    form.append('profilePicture', formData.profilePictureFile);
  }

  if (formData.documentFile instanceof File) {
    form.append('document', formData.documentFile);
  }

  return form;
};

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await apiClient.get('/employees');
  return response.data;
};

export const useEmployees = () => {
  return useQuery<Employee[], Error>({
    queryKey: ['employees'],
    queryFn: getEmployees,
  });
};

export const useEmployeeById = (id?: number) => {
  return useQuery<Employee, Error>({
    queryKey: ['employee', id],
    queryFn: async () => {
      if (id === undefined) throw new Error('Employee ID is required');
      const { data } = await apiClient.get(`/employees/${id}`);
      return data;
    },
    enabled: !!id,
  });
};


export const useCreateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<Employee, Error, EmployeeFormData>({
    mutationFn: async (formData) => {
      const form = buildEmployeeFormData(formData);
      const { data } = await apiClient.post('/employees', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<Employee, Error, { id: number; data: EmployeeUpdateDTO }>({
    mutationFn: async ({ id, data }) => {
      const form = buildEmployeeFormData(data);
      const { data: response } = await apiClient.put(`/employees/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
      await queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/employees/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
};

export const useUpdateProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation<Employee, Error, { id: number; file: File }>({
    mutationFn: async ({ id, file }) => {
      const formData = new FormData();
      formData.append('profilePicture', file);
      const { data } = await apiClient.put(`/employees/${id}/profile-picture`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['employee', data.id] });
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useUpdateDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<Employee, Error, { id: number; file: File }>({
    mutationFn: async ({ id, file }) => {
      const formData = new FormData();
      formData.append('document', file);
      const { data } = await apiClient.put(`/employees/${id}/document`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['employee', data.id] });
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/employees/${id}/profile-picture`);
    },
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ['employee', id] });
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await apiClient.delete(`/employees/${id}/document`);
    },
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ['employee', id] });
      await queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};