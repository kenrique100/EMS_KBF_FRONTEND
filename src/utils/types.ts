// src/types.ts
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface Employee {
  id: string;
  username: string;
  name: string;
  password?: string;
  dateOfEmployment: string | Date;
  status: EmployeeStatus;
  profilePicture?: File | string;
  document?: File | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface EmployeeFormData {
  id?: string;
  username: string;
  name: string;
  password: string;
  dateOfEmployment: Date | null;
  status: EmployeeStatus;
  profilePicture?: File | string | null;
  document?: File | string | null;
}


export interface Salary {
  id: string;
  amount: number;
  paymentDate: string;
  employeeId: string;
  status: string;
  paymentReference: string;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  UNCOMPLETED = 'UNCOMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string | Date;
  employeeId: string;
  employeeName?: string;
  status: TaskStatus;
  expectedHours?: number;
  actualHours?: number;
  startTime?: string | Date | null;
  stopTime?: string | Date | null;
}

export interface TaskActionDTO {
  taskId: string;
  action: 'START' | 'STOP' | 'COMPLETE';
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  deadline: Date;
  employeeId: string;
  status?: TaskStatus;
  expectedHours?: number;
}

export interface CreateSalaryPayload {
  amount: number;
  paymentDate: string;
  employeeId: string;
  paymentReference?: string;
}

export interface SalaryFormData {
  id?: string;
  amount: number | string;
  paymentDate: Date | null;
  employeeId: string;
  paymentReference: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface FileUploadResponse {
  filename: string;
  path: string;
}