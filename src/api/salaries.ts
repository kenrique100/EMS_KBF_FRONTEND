// api/salaries.ts
import apiClient from '../utils/apiClient';
import { SalaryPayment, SalaryPaymentDTO } from '@/types';

export const getSalaryPayments = async (): Promise<SalaryPayment[]> => {
  const response = await apiClient.get('/salaries');
  return response.data;
};

export const getSalaryPaymentsForEmployee = async (
  employeeId: number
): Promise<SalaryPayment[]> => {
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

export const updateSalaryPayment = async (
  id: number,
  salary: SalaryPaymentDTO
): Promise<SalaryPayment> => {
  const response = await apiClient.patch(`/salaries/${id}`, salary);
  return response.data;
};

export const deleteSalaryPayment = async (id: number): Promise<void> => {
  await apiClient.delete(`/salaries/${id}`);
};

export const downloadSalaryReceipt = async (paymentId: number, preview = false): Promise<void> => {
  const response = await apiClient.get(`/salaries/salary/${paymentId}/receipt/pdf`, {
    params: { preview },
    responseType: 'blob',
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;

  // Extract filename from content-disposition header or use default
  const contentDisposition = response.headers['content-disposition'];
  let fileName = 'salary-receipt.pdf';
  if (contentDisposition) {
    const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
    if (fileNameMatch && fileNameMatch.length > 1) {
      fileName = fileNameMatch[1];
    }
  }

  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Add a new function to get the receipt data
export const getSalaryReceipt = async (paymentId: number): Promise<any> => {
  const response = await apiClient.get(`/salaries/salary/${paymentId}/receipt`);
  return response.data;
};
