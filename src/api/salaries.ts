import api from '../config/axios';

interface Salary {
    id: number;
    amount: number;
    paymentDate: string;
    employeeId: number;
    status: string;
    paymentReference: string;
}

export const getSalaries = async (): Promise<Salary[]> => {
    const response = await api.get('/salaries');
    return response.data;
};

export const getSalaryById = async (id: number): Promise<Salary> => {
    const response = await api.get(`/salaries/${id}`);
    return response.data;
};

export const getSalariesByEmployee = async (employeeId: number): Promise<Salary[]> => {
    const response = await api.get(`/salaries/employee/${employeeId}`);
    return response.data;
};

export const createSalary = async (salaryData: Omit<Salary, 'id'>): Promise<Salary> => {
    const response = await api.post('/salaries', salaryData);
    return response.data;
};

export const deleteSalary = async (id: number): Promise<void> => {
    await api.delete(`/salaries/${id}`);
};