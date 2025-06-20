import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/constants';
import { SalaryPaymentDTO, UpdateSalaryPayload, CreateSalaryPayload } from '@/types';
import apiClient from '@/config/apiClient';

export const getSalaries = async (): Promise<SalaryPaymentDTO[]> => {
  const response = await apiClient.get('/salaries');
  return response.data;
};

export const getSalaryById = async (paymentId: number): Promise<SalaryPaymentDTO> => {
  const response = await apiClient.get(`/salaries/${paymentId}`);
  return response.data;
};

export const getSalariesByEmployee = async (employeeId: number): Promise<SalaryPaymentDTO[]> => {
  const response = await apiClient.get(`/salaries/employee/${employeeId}`);
  return response.data;
};

export const createSalary = async (salaryData: CreateSalaryPayload): Promise<SalaryPaymentDTO> => {
  const response = await apiClient.post('/salaries', {
    ...salaryData,
    status: 'PROCESSED'
  });
  return response.data;
};

export const updateSalary = async ({ id, ...salaryData }: UpdateSalaryPayload): Promise<SalaryPaymentDTO> => {
  const response = await apiClient.patch(`/salaries/${id}`, salaryData);
  return response.data;
};

export const deleteSalary = async (paymentId: number): Promise<void> => {
  await apiClient.delete(`/salaries/${paymentId}`);
};

export const useSalaries = () =>
  useQuery<SalaryPaymentDTO[], Error>({
    queryKey: [QUERY_KEYS.SALARIES],
    queryFn: getSalaries,
  });

export const useSalaryById = (paymentId?: number) =>
  useQuery<SalaryPaymentDTO, Error>({
    queryKey: [QUERY_KEYS.SALARIES, paymentId],
    queryFn: () => paymentId ? getSalaryById(paymentId) : Promise.reject(new Error('No ID provided')),
    enabled: !!paymentId,
  });

export const useSalariesByEmployee = (employeeId?: number) =>
  useQuery<SalaryPaymentDTO[], Error>({
    queryKey: [QUERY_KEYS.SALARIES, 'EMPLOYEE', employeeId],
    queryFn: () => employeeId ? getSalariesByEmployee(employeeId) : Promise.reject(new Error('No ID provided')),
    enabled: !!employeeId,
  });

export const useCreateSalary = () => {
  const queryClient = useQueryClient();
  return useMutation<SalaryPaymentDTO, Error, CreateSalaryPayload>({
    mutationFn: createSalary,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALARIES] });
    },
  });
};

export const useUpdateSalary = () => {
  const queryClient = useQueryClient();
  return useMutation<SalaryPaymentDTO, Error, UpdateSalaryPayload>({
    mutationFn: updateSalary,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALARIES] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALARIES, data.id] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALARIES, 'EMPLOYEE', data.employeeId] });
    },
  });
};

export const useDeleteSalary = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteSalary,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SALARIES] });
    },
  });
};