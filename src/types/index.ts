// src/types/index.ts
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'UNCOMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PROCESSED' | 'FAILED' | 'CANCELLED' | 'PAID';
export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: Role[];
}

export interface Department {
  id: number;
  name: string;
  displayName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}


export interface Employee {
  id: number;
  username: string;
  name: string;
  email: string;
  phoneNumber?: string;
  department: Department;
  dateOfEmployment: string;
  status: EmployeeStatus;
  profilePicturePath?: string;
  documentPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDTO {
  id?: number;
  username: string;
  name: string;
  password: string;
  email: string;
  phoneNumber?: string;
  department: string;
  dateOfEmployment: string;
  status?: EmployeeStatus;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  deadline: string;
  employeeId: number;
  employeeName: string;
  status: TaskStatus;
  expectedHours: number;
  actualHours?: number;
  startTime?: string;
  stopTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskActionDTO {
  taskId: number;
  action: string;
}

export interface TaskDTO {
  id?: number;
  title: string;
  description?: string;
  deadline: string;
  employeeId: number;
  expectedHours: number;
}

export interface SalaryPayment {
  id: number;
  amount: number;
  paymentDate: string;
  employeeId: number;
  employeeName: string;
  status: PaymentStatus;
  paymentReference: string;
  createdAt: string;
}


export interface SalaryPaymentDTO {
  id?: number;
  amount: number;
  paymentDate: string;
  employeeId: number;
  paymentReference?: string;
  createdAt?: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}