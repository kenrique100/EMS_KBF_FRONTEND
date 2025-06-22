import { useQuery, useMutation } from '@tanstack/react-query';
import { SalaryPaymentDTO, SalaryPayment } from '@/types';
import { getSalaryPaymentById, getSalaryPayments, updateSalaryPayment } from '@/api/salaries';


export const useSalaries = () => {
  return useQuery<SalaryPayment[]>({
    queryKey: ['salaries'],
    queryFn: getSalaryPayments,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};


export const useSalaryById = (id?: number) =>
  useQuery<SalaryPayment>({
    queryKey: ['salary', id],
    queryFn: () => getSalaryPaymentById(id!),
    enabled: !!id,
  });

export const useUpdateSalary = () =>
  useMutation({
    mutationFn: ({ id, ...data }: { id: number } & SalaryPaymentDTO) =>
      updateSalaryPayment(id, data),
  });