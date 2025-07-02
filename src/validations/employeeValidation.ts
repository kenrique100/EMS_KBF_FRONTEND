// src/validations/employeeValidation.ts
import * as yup from 'yup';
import { EmployeeDTO } from '@/types';

const phoneRegex = /^\+?[0-9\s-]{10,}$/;
const nationalIdRegex = /^[0-9]{9,15}$/;

// Define Department and EmployeeStatus as enums for validation
const Department = {
  ADMINISTRATION: 'ADMINISTRATION',
  FISHERY: 'FISHERY',
  POULTRY: 'POULTRY',
  RABBITRY: 'RABBITRY',
  CONSTRUCTION: 'CONSTRUCTION',
  CROPS: 'CROPS',
  LIVESTOCK: 'LIVESTOCK',
  FARM_MANAGEMENT: 'FARM_MANAGEMENT'
} as const;

const EmployeeStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_LEAVE: 'ON_LEAVE',
  SUSPENDED: 'SUSPENDED',
  TERMINATED: 'TERMINATED'
} as const;

export const employeeSchema = yup.object().shape({
  id: yup.number().optional(),

  username: yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters'),

  name: yup.string()
    .required('Full name is required')
    .max(100, 'Name cannot exceed 100 characters'),

  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),

  email: yup.string()
    .email('Invalid email')
    .required('Email is required')
    .max(100, 'Email cannot exceed 100 characters'),

  phoneNumber: yup.string()
    .matches(phoneRegex, 'Invalid phone number')
    .optional(),

  nationalId: yup.string()
    .matches(nationalIdRegex, 'National ID must be 9-15 digits')
    .optional(),

  department: yup.string()
    .oneOf(Object.values(Department))
    .required('Department is required'),

  dateOfEmployment: yup.string()
    .required('Date of employment is required')
    .test('is-date', 'Invalid date format', (value) => {
      if (!value) return false;
      return !isNaN(Date.parse(value));
    }),

  status: yup.string()
    .oneOf(Object.values(EmployeeStatus))
    .optional(),

  profilePicturePath: yup.string().optional(),
  documentPath: yup.string().optional(),
  statusExpiration: yup.string().optional(),
  totalHoursWorkedLast30Days: yup.number().optional(),
  suspensionDuration: yup.string().optional(),
  createdAt: yup.string().optional(),
  updatedAt: yup.string().optional(),
}) as yup.ObjectSchema<EmployeeDTO>;