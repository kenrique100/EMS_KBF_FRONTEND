// src/types.ts
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';

export interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    roles: string[];
}

export interface Employee {
  id: string;
  username: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  department?: string;
  password?: string;
  dateOfEmployment: string | Date;
  status: EmployeeStatus;
  profilePicture?: string | File;
  document?: string | File;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface EmployeeFormData {
  id?: string;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  department: string;
  password: string;
  dateOfEmployment: Date | null;
  status: EmployeeStatus;
  profilePicture?: string | File | null;
  document?: string | File | null;
}


export interface Salary {
  id: string;
  amount: number;
  paymentDate: string;
  employeeId: string;
  employeeName?: string;
  status: PaymentStatus;
  paymentReference: string;
  createdAt?: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
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
  paymentReference: string;
  status?: PaymentStatus;
}

export interface SalaryFormData {
  id?: string;
  amount: string | number;
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
  size: number;
  mimetype: string;
}
