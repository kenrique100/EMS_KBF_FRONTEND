import { Employee, EmployeeFormData } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/config/apiClient';

// --- Utility function to build FormData ---
const buildEmployeeFormData = (formData: EmployeeFormData): FormData => {
    const form = new FormData();
    form.append(
      'employee',
      JSON.stringify({
          username: formData.username,
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          department: formData.department,
          password: formData.password,
          dateOfEmployment: formData.dateOfEmployment?.toISOString(),
          status: formData.status,
      })
    );

    if (formData.profilePicture instanceof File) {
        form.append('profilePicture', formData.profilePicture);
    }

    if (formData.document instanceof File) {
        form.append('document', formData.document);
    }

    return form;
};

// --- API functions ---
export const getEmployees = async (): Promise<Employee[]> => {
    const { data } = await apiClient.get('/api/employees');
    return data;
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
    const { data } = await apiClient.get(`/api/employees/${id}`);
    return data;
};

export const createEmployee = async (formData: EmployeeFormData): Promise<Employee> => {
    const form = buildEmployeeFormData(formData);
    const { data } = await apiClient.post('/api/employees', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

export const updateEmployee = async (id: string, formData: EmployeeFormData): Promise<Employee> => {
    const form = buildEmployeeFormData(formData);
    const { data } = await apiClient.put(`/api/employees/${id}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
    await apiClient.delete(`/api/employees/${id}`);
};

// --- React Query Hooks ---
export const useEmployees = () =>
  useQuery<Employee[], Error>({
      queryKey: ['employees'],
      queryFn: getEmployees,
  });

export const useEmployeeById = (id: string) =>
  useQuery<Employee, Error>({
      queryKey: ['employee', id],
      queryFn: () => getEmployeeById(id),
      enabled: !!id,
  });

export const useCreateEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation<Employee, Error, EmployeeFormData>({
        mutationFn: createEmployee,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
};

export const useUpdateEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation<Employee, Error, { id: string; data: EmployeeFormData }>({
        mutationFn: ({ id, data }) => updateEmployee(id, data),
        onSuccess: (_, variables) => {
            void queryClient.invalidateQueries({ queryKey: ['employees'] });
            void queryClient.invalidateQueries({ queryKey: ['employee', variables.id] });
        },
    });
};

export const useDeleteEmployee = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, string>({
        mutationFn: deleteEmployee,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['employees'] });
        },
    });
};
