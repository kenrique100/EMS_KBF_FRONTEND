// Employee & Auth Types

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: Role[];
  createdAt?: string;
  updatedAt?: string;
}

// Employee Core

export type Department =
  | 'FISHERY'
  | 'POULTRY'
  | 'RABBITRY'
  | 'CONSTRUCTION'
  | 'CROPS'
  | 'LIVESTOCK'
  | 'DAIRY'
  | 'AGRO_FORESTRY'
  | 'IRRIGATION'
  | 'FARM_MANAGEMENT'
  | 'AGRICULTURAL_ENGINEERING'
  | 'FOOD_PROCESSING';

export interface Employee {
  id: number;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  department: Department;
  password?: string;
  dateOfEmployment: string;
  status: EmployeeStatus;
  profilePicturePath?: string;
  documentPath?: string;
  salaryPayments?: SalaryPaymentDTO[];
  tasks?: TaskDTO[];
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeFormData {
  id?: number;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  department: Department;
  password: string;
  dateOfEmployment: Date | null;
  status: EmployeeStatus;
  profilePicturePath?: string | null;
  documentPath?: string | null;
  profilePictureFile?: File | null;
  documentFile?: File | null;
}

export interface EmployeeUpdateDTO {
  id?: number;
  username?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  department?: Department;
  password?: string;
  dateOfEmployment?: Date | null;
  status?: EmployeeStatus;
  profilePictureFile?: File | null;
  documentFile?: File | null;
}

export interface EmployeeProfileDTO {
  id: number;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  department: Department;
  dateOfEmployment: string;
  status: EmployeeStatus;
  profilePicturePath?: string;
  documentPath?: string;
  createdAt: string;
  updatedAt: string;
}


// Salary Types

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface Salary {
  id: number;
  amount: number;
  paymentDate: string;
  employeeId: number;
  employeeName?: string;
  status: PaymentStatus;
  paymentReference: string;
  createdAt?: string;
}

export interface SalaryPaymentDTO {
  id: number;
  amount: number;
  paymentDate: string;
  employeeId: number;
  employeeName?: string;
  status: PaymentStatus;
  paymentReference?: string;
  createdAt?: string;
}

export interface CreateSalaryPayload {
  amount: number;
  paymentDate: string;
  employeeId: number;
  paymentReference?: string;
}

export interface UpdateSalaryPayload {
  id: number;
  amount?: number;
  paymentDate?: string;
  employeeId?: number;
  paymentReference?: string;
}

export interface SalaryFormData {
  id: number;
  amount: number;
  paymentDate: Date | null;
  employeeId: number;
  paymentReference?: string;
  status: PaymentStatus;
}

// Task Types

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  UNCOMPLETED = 'UNCOMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Task {
  id: number;
  title: string;
  description: string;
  deadline: Date | string;
  employeeId: number;
  employeeName?: string;
  status: TaskStatus;
  expectedHours?: number;
  actualHours?: number;
  startTime?: Date | string | null;
  stopTime?: Date | string | null;
}

export interface TaskDTO {
  id: number;
  title: string;
  description: string;
  deadline: Date | string;
  employeeId: number;
  employeeName?: string;
  status: TaskStatus;
  expectedHours?: number;
  actualHours?: number;
  startTime?: Date | string;
  stopTime?: Date | string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
}

export interface TaskActionDTO {
  taskId: number;
  action: 'START' | 'STOP' | 'COMPLETE';
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  deadline: Date | string;
  employeeId: number;
  status?: TaskStatus;
  expectedHours?: number;
  actualHours?: number;
  startTime?: Date | string;
  stopTime?: Date | string;
}


// Misc Types

export interface ValidationErrors {
  [key: string]: string;
}

export interface FileUploadResponse {
  filename: string;
  path: string;
  size: number;
  mimetype: string;
  url: string;
}
