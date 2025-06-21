import apiClient from '../utils/apiClient';
import { SalaryPayment, SalaryPaymentDTO } from '@/types';

export const getSalaryPayments = async (): Promise<SalaryPayment[]> => {
  const response = await apiClient.get('/salaries');
  return response.data;
};

export const getSalaryPaymentsForEmployee = async (employeeId: number): Promise<SalaryPayment[]> => {
  const response = await apiClient.get(`/salaries/employee/${employeeId}`);
  return response.data;
};

export const getSalaryPaymentById = async (id: number): Promise<SalaryPayment> => {
  const response = await apiClient.get(`/salaries/${id}`);
  return response.data;
};

export const createSalaryPayment = async (salary: SalaryPaymentDTO): Promise<SalaryPayment> => {
  const response = await apiClient.post('/salaries', salary);
  return response.data;
};

export const updateSalaryPayment = async (id: number, salary: SalaryPaymentDTO): Promise<SalaryPayment> => {
  const response = await apiClient.patch(`/salaries/${id}`, salary);
  return response.data;
};

export const deleteSalaryPayment = async (id: number): Promise<void> => {
  await apiClient.delete(`/salaries/${id}`);
};