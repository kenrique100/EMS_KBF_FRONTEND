// src/validations/employeeValidation.ts
import * as yup from 'yup';
import { EmployeeDTO } from '@/types';

/**
 * Regex for basic phone number validation.
 */
const phoneRegex = /^\+?[0-9\s-]{10,}$/;

/**
 * Yup validation schema for EmployeeDTO.
 * Uses inline enum values instead of referencing EmployeeStatus.
 */
export const employeeSchema: yup.ObjectSchema<EmployeeDTO> = yup.object({
    id: yup.number().optional(),

    username: yup.string().required('Username is required'),

    name: yup.string().required('Full name is required'),

    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),

    email: yup
      .string()
      .email('Invalid email')
      .required('Email is required'),

    phoneNumber: yup
      .string()
      .matches(phoneRegex, 'Invalid phone number')
      .optional(),

    department: yup
      .string()
      .oneOf([
          'ADMINISTRATION', 'FISHERY', 'POULTRY', 'RABBITRY',
          'CONSTRUCTION', 'CROPS', 'LIVESTOCK', 'FARM_MANAGEMENT'
      ])
      .required('Department is required'),

    dateOfEmployment: yup
      .string()
      .required('Date of employment is required'),

    // Instead of using EmployeeStatus (which is a type only),
    // we directly specify the allowed values.
    status: yup
      .string()
      .oneOf(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'])
      .optional(),

    profilePicturePath: yup.string().optional(),
    documentPath: yup.string().optional(),
}).required();
