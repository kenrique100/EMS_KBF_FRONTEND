import * as yup from 'yup';
import { TaskDTO } from '@/types';

/**
 * Yup schema for validating TaskDTO.
 * Compatible with Yup v0.32.x (no SchemaOf).
 */
export const taskSchema: yup.ObjectSchema<TaskDTO> = yup
  .object({
    id: yup.number().optional(),

    title: yup
      .string()
      .trim()
      .required('Title is required'),

    description: yup
      .string()
      .trim()
      .optional(),

    deadline: yup
      .string()
      .required('Deadline is required')
      .test('is-date', 'Deadline must be a valid date', (value) =>
        value ? !Number.isNaN(Date.parse(value)) : false
      ),

    employeeId: yup
      .number()
      .typeError('Please select an employee')
      .required('Employee is required')
      .positive()
      .integer(),

    expectedHours: yup
      .number()
      .typeError('Expected hours must be a number')
      .required('Expected hours is required')
      .positive(),
  })
  .required();
