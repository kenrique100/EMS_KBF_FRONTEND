// src/validations/employeeValidation.ts
import * as yup from 'yup';
import { EmployeeDTO } from '@/types';

const phoneRegex = /^\+?[0-9\s-]{10,}$/;
const nationalIdRegex = /^[0-9]{9,15}$/;

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
  id: yup.number().notRequired(),

  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters'),

  name: yup
    .string()
    .required('Full name is required')
    .max(100, 'Name cannot exceed 100 characters'),

  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .notRequired()
    .nullable(),

  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required')
    .max(100, 'Email cannot exceed 100 characters'),

  phoneNumber: yup
    .string()
    .matches(phoneRegex, 'Invalid phone number')
    .notRequired()
    .nullable(),

  gender: yup
    .mixed<Gender>()
    .oneOf(['MALE', 'FEMALE'], 'Gender must be either MALE or FEMALE')
    .required('Gender is required'),

  dateOfBirth: yup.string()
    .required('Date of birth is required')
    .test('valid-date', 'Invalid date', val => !isNaN(Date.parse(val ?? '')))
    .test('age', 'Must be 18+', val => {
      if (!val) return false;
      const birthDate = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      return age >= 18;
    }),

  nationalId: yup
    .string()
    .matches(nationalIdRegex, 'National ID must be 9-15 digits')
    .notRequired()
    .nullable(),

  department: yup
    .string()
    .oneOf(Object.values(Department), 'Invalid department')
    .required('Department is required'),

  dateOfEmployment: yup
    .string()
    .required('Date of employment is required')
    .test('is-date', 'Invalid date format', (value) => {
      if (!value) return false;
      return !isNaN(Date.parse(value));
    }),

  status: yup
    .string()
    .oneOf(Object.values(EmployeeStatus), 'Invalid status')
    .notRequired()
    .nullable(),

  profilePicturePath: yup.string().notRequired().nullable(),
  documentPath: yup.string().notRequired().nullable(),
  statusExpiration: yup.string().notRequired().nullable(),
  totalHoursWorkedLast30Days: yup.number().notRequired().nullable(),
  suspensionDuration: yup.string().notRequired().nullable(),
  createdAt: yup.string().notRequired().nullable(),
  updatedAt: yup.string().notRequired().nullable(),
}) as yup.ObjectSchema<EmployeeDTO>;
