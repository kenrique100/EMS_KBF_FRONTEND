import {
  CreateTaskDTO,
  EmployeeFormData,
  EmployeeUpdateDTO,
  SalaryFormData,
  ValidationErrors,
} from '@/types';

// src/utils/validators.ts
export const validateEmployee = (
  formData: EmployeeFormData | EmployeeUpdateDTO,
  isNewEmployee: boolean = false
): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (isNewEmployee && !formData.username) {
        errors.username = 'Username is required';
    }

    if (!formData.name) {
        errors.name = 'Name is required';
    }

    if (!formData.email) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
    }

    if (formData.phoneNumber && !/^\+?[0-9\s-]{10,}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Invalid phone number format';
    }

    if (isNewEmployee && !formData.password) {
        errors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.department) {
        errors.department = 'Department is required';
    }

    if (!formData.dateOfEmployment) {
        errors.dateOfEmployment = 'Date of employment is required';
    }

    return errors;
};

export const validateSalary = (data: SalaryFormData): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!data.amount || Number(data.amount) <= 0) {
        errors.amount = 'Amount must be greater than 0';
    }

    if (!data.paymentDate) {
        errors.paymentDate = 'Payment date is required';
    }

    if (!data.employeeId) {
        errors.employeeId = 'Employee is required';
    }

    return errors;
};

export const validateTask = (data: CreateTaskDTO): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!data.title?.trim()) {
        errors.title = 'Title is required';
    }

    if (!data.deadline) {
        errors.deadline = 'Deadline is required';
    } else if (new Date(data.deadline) < new Date()) {
        errors.deadline = 'Deadline must be in the future';
    }

    if (!data.employeeId) {
        errors.employeeId = 'Employee is required';
    }

    return errors;
};