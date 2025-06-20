import { useQuery, useMutation } from '@tanstack/react-query';
import { SalaryPaymentDTO, SalaryPayment } from '@/types';
import { getSalaryPaymentById, updateSalaryPayment } from '@/api/salaries';

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