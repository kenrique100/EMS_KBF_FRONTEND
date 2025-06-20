// src/validations/employeeValidation.ts
import {
    object,
    string,
    ObjectSchema,     // ✅ use ObjectSchema instead of SchemaOf
} from 'yup';
import { EmployeeDTO } from '@/types';

/**
 * Convenience type:
 *  - when creating a new employee we never send `id` or `status`
 */
type EmployeeCreate = Omit<EmployeeDTO, 'id' | 'status'>;

/** 📞 Shared phone‑number regex */
const phoneRegex = /^\+?[0-9\s-]{10,}$/;

/**
 * Validation schema for *creating* an employee.
 * `ObjectSchema<EmployeeCreate>` gives you full type‑safety in your form code.
 */
export const employeeSchema: ObjectSchema<EmployeeCreate> = object({
    username: string().required('Username is required'),
    name: string().required('Full name is required'),
    password: string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    email: string().email('Invalid email').required('Email is required'),
    phoneNumber: string()
      .optional()
      .matches(phoneRegex, 'Invalid phone number'),
    department: string().required('Department is required'),
    dateOfEmployment: string().required('Date of employment is required'),
}).required();

/**
 * Validation schema for *updating* an employee.
 * All fields are optional, so we wrap the EmployeeCreate type in Partial<>.
 */
/*
export const employeeUpdateSchema: ObjectSchema<Partial<EmployeeCreate>> = object({
    username: string(),
    name: string(),
    password: string().min(6, 'Password must be at least 6 characters'),
    email: string().email('Invalid email'),
    phoneNumber: string().matches(phoneRegex, 'Invalid phone number'),
    department: string(),
    dateOfEmployment: date(),
}).noUnknown();
*/
