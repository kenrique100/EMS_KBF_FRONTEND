import { CreateTaskDTO, EmployeeFormData, SalaryFormData, ValidationErrors } from '@/types';

export const validateEmployee = (data: EmployeeFormData, isNew = false): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (isNew && !data.username?.trim()) {
        errors.username = 'Username is required';
    } else if (isNew && data.username && data.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
    }

    if (!data.name?.trim()) {
        errors.name = 'Name is required';
    }

    if (isNew && !data.password?.trim()) {
        errors.password = 'Password is required';
    } else if (data.password && data.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
    }

    if (!data.dateOfEmployment) {
        errors.dateOfEmployment = 'Date of employment is required';
    }

    if (!data.email?.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Invalid email format';
    }

    if (!data.department?.trim()) {
        errors.department = 'Department is required';
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