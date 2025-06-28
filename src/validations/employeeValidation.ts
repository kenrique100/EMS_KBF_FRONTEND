import * as yup from 'yup';
import { EmployeeDTO, Department, EmployeeStatus } from '@/types';

/**
 * Regex for basic phone number validation.
 */
const phoneRegex = /^\+?[0-9\s-]{10,}$/;

/**
 * Yup validation schema for EmployeeDTO
 */
export const employeeSchema: yup.ObjectSchema<EmployeeDTO> = yup.object({
  id: yup.number().optional(),

  username: yup.string().required('Username is required'),

  name: yup.string().required('Full name is required'),

  // Make password optional to match EmployeeDTO
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),

  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required'),

  phoneNumber: yup
    .string()
    .matches(phoneRegex, 'Invalid phone number')
    .optional(),

  department: yup
    .mixed<Department>()
    .oneOf([
      'ADMINISTRATION',
      'FISHERY',
      'POULTRY',
      'RABBITRY',
      'CONSTRUCTION',
      'CROPS',
      'LIVESTOCK',
      'FARM_MANAGEMENT',
    ])
    .required('Department is required'),

  dateOfEmployment: yup.string().required('Date of employment is required'),

  status: yup
    .mixed<EmployeeStatus>()
    .oneOf(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'SUSPENDED', 'TERMINATED'])
    .optional(),

  profilePicturePath: yup.string().optional(),
  documentPath: yup.string().optional(),

  // Include these to match EmployeeDTO type
  createdAt: yup.string().required('Creation timestamp is required'),
  updatedAt: yup.string().required('Update timestamp is required'),
}).required();
