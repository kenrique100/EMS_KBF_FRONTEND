import * as yup from 'yup';

export const salarySchema = yup.object().shape({
  amount: yup
    .number()
    .positive('Amount must be positive')
    .required('Amount is required')
    .test(
      'decimal',
      'Amount must have up to 2 decimal places',
      value => !value || /^\d+(\.\d{1,2})?$/.test(value.toString())
    ),
  paymentDate: yup
    .string()
    .required('Payment date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  employeeId: yup
    .number()
    .positive('Employee ID must be positive')
    .required('Employee is required'),
  paymentReference: yup
    .string()
    .nullable()
    .max(50, 'Payment reference must be less than 50 characters'),
});