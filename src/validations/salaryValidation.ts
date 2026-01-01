// validations/salaryValidation.ts
import * as yup from 'yup';
import { SalaryPaymentDTO } from '@/types';

export const salarySchema = yup.object().shape({
  id: yup.number().optional(),

  employeeId: yup.number().required('Employee is required').positive('Invalid employee selection'),

  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be greater than 0')
    .typeError('Amount must be a number'),

  paymentDate: yup
    .string()
    .required('Payment date is required')
    .test('is-date', 'Invalid date format (use YYYY-MM-DD)', (value) => {
      if (!value) return false;
      return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
    })
    .test('not-future', 'Payment date cannot be in the future', (value) => {
      if (!value) return true;
      const paymentDate = new Date(value);
      const today = new Date();
      return paymentDate <= today;
    }),

  paymentReference: yup.string().optional(),

  employeeName: yup.string().optional(),
  status: yup.string().optional(),
  createdAt: yup.string().optional(),
}) as yup.ObjectSchema<SalaryPaymentDTO>;
