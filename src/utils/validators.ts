// src/utils/validation.ts
import { CreateTaskDTO, EmployeeFormData, SalaryFormData, ValidationErrors } from '@/utils/types';

export const validateEmployee = (data: EmployeeFormData, isNew = false): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (isNew && !data.username?.trim()) {
        errors.username = 'Username is required';
    }

    if (!data.name?.trim()) {
        errors.name = 'Name is required';
    }

    if (isNew && !data.password?.trim()) {
        errors.password = 'Password is required';
    }

    if (!data.dateOfEmployment) {
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
    }

    if (!data.employeeId?.trim()) {
        errors.employeeId = 'Employee is required';
    }

    return errors;
};