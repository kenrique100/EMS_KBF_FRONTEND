import apiClient from '../utils/apiClient';
import { SalaryPayment, SalaryPaymentDTO } from '@/types';

export const getSalaryPayments = async (): Promise<SalaryPayment[]> => {
  const response = await apiClient.get('/api/salaries');
  return response.data;
};

export const getSalaryPaymentsForEmployee = async (employeeId: number): Promise<SalaryPayment[]> => {
  const response = await apiClient.get(`/api/salaries/employee/${employeeId}`);
  return response.data;
};

export const getSalaryPaymentById = async (id: number): Promise<SalaryPayment> => {
  const response = await apiClient.get(`/api/salaries/${id}`);
  return response.data;
};

export const createSalaryPayment = async (salary: SalaryPaymentDTO): Promise<SalaryPayment> => {
  const response = await apiClient.post('/api/salaries', salary);
  return response.data;
};

export const updateSalaryPayment = async (id: number, salary: SalaryPaymentDTO): Promise<SalaryPayment> => {
  const response = await apiClient.patch(`/api/salaries/${id}`, salary);
  return response.data;
};

export const deleteSalaryPayment = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/salaries/${id}`);
};