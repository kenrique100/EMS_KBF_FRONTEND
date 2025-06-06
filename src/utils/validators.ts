export const validateEmployee = (data, isNew = false) => {
    const errors = {};

    if (isNew && !data.username) {
        errors.username = 'Username is required';
    }

    if (!data.name) {
        errors.name = 'Name is required';
    }

    if (isNew && !data.password) {
        errors.password = 'Password is required';
    }

    if (!data.dateOfEmployment) {
        errors.dateOfEmployment = 'Date of employment is required';
    }

    return errors;
};

export const validateTask = (data) => {
    const errors = {};

    if (!data.title) {
        errors.title = 'Title is required';
    }

    if (!data.deadline) {
        errors.deadline = 'Deadline is required';
    }

    if (!data.employeeId) {
        errors.employeeId = 'Employee is required';
    }

    return errors;
};

export const validateSalary = (data) => {
    const errors = {};

    if (!data.amount || data.amount <= 0) {
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