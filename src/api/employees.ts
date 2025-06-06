import api from '../config/axios';

interface Employee {
    id: number;
    username: string;
    name: string;
    dateOfEmployment: string;
    status: string;
}

export const getEmployees = async (): Promise<Employee[]> => {
    const response = await api.get('/employees');
    return response.data;
};

export const getEmployeeById = async (id: number): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
};

export const createEmployee = async (
    employeeData: Omit<Employee, 'id'>,
    profilePicture?: File,
    document?: File
): Promise<Employee> => {
    const formData = new FormData();
    formData.append('employee', new Blob([JSON.stringify(employeeData)], {
        type: 'application/json',
    }));
    if (profilePicture) formData.append('profilePicture', profilePicture);
    if (document) formData.append('document', document);

    const response = await api.post('/employees', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateEmployee = async (
    id: number,
    employeeData: Partial<Employee>
): Promise<Employee> => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
};

export const getEmployeeFiles = async (): Promise<string[]> => {
    const response = await api.get('/employees/files');
    return response.data;
};

export const downloadEmployeeFile = async (
    subDirectory: string,
    filename: string
): Promise<Blob> => {
    const response = await api.get(`/employees/files/${subDirectory}/${filename}`, {
        responseType: 'blob',
    });
    return response.data;
};