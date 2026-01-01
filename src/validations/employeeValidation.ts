// src/validations/employeeValidation.ts
import * as yup from 'yup';
import { EmployeeDTO } from '@/types';

const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
const nationalIdRegex = /^[0-9]{9,15}$/;
const usernameRegex = /^[a-zA-Z0-9._-]+$/;

export const Department = {
  ADMINISTRATION: 'ADMINISTRATION',
  FISHERY: 'FISHERY',
  POULTRY: 'POULTRY',
  RABBITRY: 'RABBITRY',
  CONSTRUCTION: 'CONSTRUCTION',
  CROPS: 'CROPS',
  LIVESTOCK: 'LIVESTOCK',
  FARM_MANAGEMENT: 'FARM_MANAGEMENT',
} as const;

export const EmployeeStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ON_LEAVE: 'ON_LEAVE',
  SUSPENDED: 'SUSPENDED',
  TERMINATED: 'TERMINATED',
} as const;

export type Gender = 'MALE' | 'FEMALE';

export const employeeSchema = yup.object().shape({
  id: yup.number().optional(),

  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username cannot exceed 50 characters')
    .matches(
      usernameRegex,
      'Username can only contain letters, numbers, dots, underscores and hyphens'
    ),

  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),

  // Password is required for creation, optional for update
  password: yup.string().when('id', {
    is: undefined, // Required when creating (no id)
    then: (schema) =>
      schema
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@#$%^&+=!]/, 'Password must contain at least one special character'),
    otherwise: (schema) =>
      schema
        .notRequired()
        .nullable()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/\d/, 'Password must contain at least one number')
        .matches(/[@#$%^&+=!]/, 'Password must contain at least one special character')
        .transform((value) => (value === '' || value === null ? undefined : value)),
  }),

  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required')
    .max(100, 'Email cannot exceed 100 characters'),

  phoneNumber: yup
    .string()
    .required('Phone number is required')
    .matches(phoneRegex, 'Phone number must be 10-15 digits and may start with +'),

  gender: yup
    .mixed<Gender>()
    .oneOf(['MALE', 'FEMALE'], 'Gender must be either MALE or FEMALE')
    .required('Gender is required'),

  dateOfBirth: yup
    .string()
    .required('Date of birth is required')
    .test('valid-date', 'Invalid date format (use YYYY-MM-DD)', (val) => {
      if (!val) return false;
      return /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(Date.parse(val));
    })
    .test('age', 'Employee must be at least 18 years old', (val) => {
      if (!val) return false;
      const birthDate = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18;
    }),

  nationalId: yup
    .string()
    .required('National ID is required')
    .matches(nationalIdRegex, 'National ID must be 9-15 digits'),

  department: yup
    .string()
    .oneOf(Object.values(Department), 'Invalid department')
    .required('Department is required'),

  dateOfEmployment: yup
    .string()
    .required('Date of employment is required')
    .test('is-date', 'Invalid date format (use YYYY-MM-DD)', (value) => {
      if (!value) return false;
      return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
    })
    .test('not-future', 'Date of employment cannot be in the future', (value) => {
      if (!value) return true;
      const employmentDate = new Date(value);
      const today = new Date();
      return employmentDate <= today;
    }),

  status: yup.string().oneOf(Object.values(EmployeeStatus), 'Invalid status').optional().nullable(),

  profilePicturePath: yup.string().optional().nullable(),
  documentPath: yup.string().optional().nullable(),
  statusExpiration: yup.string().optional().nullable(),
  totalHoursWorkedLast30Days: yup.number().optional().nullable(),
  suspensionDuration: yup.string().optional().nullable(),
  createdAt: yup.string().optional().nullable(),
  updatedAt: yup.string().optional().nullable(),
}) as yup.ObjectSchema<EmployeeDTO>;
