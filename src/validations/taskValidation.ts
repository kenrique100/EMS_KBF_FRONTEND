import * as yup from 'yup';
import { TaskDTO } from '@/types';

export const taskSchema: yup.ObjectSchema<TaskDTO> = yup.object({
  id: yup.number().optional(),
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .max(100, 'Title must be at most 100 characters'),
  description: yup
    .string()
    .trim()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
  deadline: yup
    .string()
    .required('Deadline is required')
    .test('is-future', 'Deadline must be in the future', (value) => {
      if (!value) return false;
      return new Date(value) > new Date();
    }),
  employeeId: yup
    .number()
    .required('Employee is required')
    .typeError('Please select an employee')
    .positive()
    .integer(),
  employeeName: yup.string().optional(),
  status: yup
    .string()
    .oneOf([
      'PENDING',
      'IN_PROGRESS',
      'STOPPED',
      'SUBMITTED',
      'COMPLETED',
      'UNCOMPLETED',
      'CANCELLED',
    ])
    .optional(),
  expectedHours: yup
    .number()
    .required('Expected hours is required')
    .typeError('Expected hours must be a number')
    .min(1, 'Minimum 1 hour')
    .max(24, 'Maximum 24 hours'),
  actualHours: yup.number().optional(),
  totalWorkedMinutes: yup.number().optional(),
  startTime: yup.string().optional(),
  stopTime: yup.string().optional(),
  lastResumeTime: yup.string().optional(),
  createdAt: yup.string().optional(),
  updatedAt: yup.string().optional(),
  isValidated: yup.boolean().optional(),
  validationTime: yup.string().optional(),
  submitted: yup.boolean().optional(),
});
