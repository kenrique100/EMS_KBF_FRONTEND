export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'UNCOMPLETED' | 'STOPPED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PROCESSED' | 'FAILED' | 'CANCELLED';
export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export type Department =
  'ADMINISTRATION' |
  'FISHERY' |
  'POULTRY' |
  'RABBITRY' |
  'CONSTRUCTION' |
  'CROPS' |
  'LIVESTOCK' |
  'FARM_MANAGEMENT';

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  roles: Role[];
  profilePicturePath?: string;
  department?: Department;
  dateOfEmployment?: string;
  status?: EmployeeStatus;
  createdAt?: string;
  updatedAt?: string;
  phoneNumber?: string;
  documentPath?: string;
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

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
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
  statusChangeTimestamp?: string;
  totalHoursWorkedLast30Days?: number;
  statusExpiration?: string;
  suspensionDuration?: string;
  terminationTimestamp?: string;
  statusHistory?: EmployeeStatusHistoryDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeDTO {
  id: number;
  username: string;
  name: string;
  password?: string;
  email: string;
  phoneNumber?: string;
  department: Department;
  dateOfEmployment: string;
  status: EmployeeStatus;
  profilePicturePath?: string;
  documentPath?: string;
  statusExpiration?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeStatusUpdateDTO {
  status: EmployeeStatus;
  leaveStartDate?: string;
  expectedReturnDate?: string;
  suspensionDuration?: string;
}

export interface EmployeeStatusHistoryDTO {
  id?: number;
  status: EmployeeStatus;
  startTimestamp: string;
  endTimestamp?: string;
  allocatedDuration?: string;
  actualDuration?: string;
  expectedEndTimestamp?: string;
}

export interface EmployeeProfileDTO {
  id: number;
  username: string;
  name: string;
  email: string;
  phoneNumber?: string;
  department: Department;
  dateOfEmployment: string;
  status: EmployeeStatus;
  statusChangeTimestamp?: string;
  statusExpiration?: string;
  suspensionDuration?: string;
  terminationTimestamp?: string;
  statusHistory: EmployeeStatusHistoryDTO[];
  profilePicturePath?: string;
  documentPath?: string;
  totalHoursWorkedLast30Days: number;
  salaryPayments: SalaryPaymentDTO[];
  tasks: TaskDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeUpdateDTO {
  id?: number;
  username?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  department?: Department;
  dateOfEmployment?: string;
  password?: string;
  status?: EmployeeStatus;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  deadline: string;
  employeeId: number;
  employeeName?: string;
  status: TaskStatus;
  expectedHours: number;
  actualHours?: number;
  totalWorkedMinutes?: number;
  startTime?: string;
  stopTime?: string;
  lastResumeTime?: string;
  isValidated?: boolean;
  validationTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskActionDTO {
  taskId: number;
  action: 'START' | 'STOP' | 'CONTINUE' | 'COMPLETE';
}

export interface TaskDTO {
  id?: number;
  title: string;
  description?: string;
  deadline: string;
  employeeId: number;
  employeeName?: string;
  status?: TaskStatus;
  expectedHours?: number;
  actualHours?: number;
  totalWorkedMinutes?: number;
  startTime?: string;
  stopTime?: string;
  lastResumeTime?: string;
  createdAt?: string;
  updatedAt?: string;
  isValidated?: boolean;
  validationTime?: string;
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
  employeeName?: string;
  status?: PaymentStatus;
  paymentReference?: string;
  createdAt?: string;
}

export interface ProductivityStatsDTO {
  totalHoursWorked: number;
  dailyAverage: number;
  workingDays: number;
  periodStartDate: string;
  periodEndDate: string;
  productivityPercentage: number;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface TaskValidationDTO {
  taskId: number;
  approve: boolean;
}

// In your types file (e.g., src/types/index.ts)
export interface SalaryReceiptDTO {
  receiptNumber: string;
  issueDate: string;
  employee: {
    id: number;
    name: string;
    department: string;
    employmentDate: string;
  };
  salary: {
    amount: number;
    paymentDate: string;
    paymentReference: string;
    status: string;
  };
  tasks?: Array<{
    title: string;
    expectedHours: number;
    actualHours: number;
    completionRate: number;
    status: string;
  }>;
  productivitySummary?: {
    totalExpectedHours: number;
    totalActualHours: number;
    overallProductivity: number;
    workingDays: number;
  };
}