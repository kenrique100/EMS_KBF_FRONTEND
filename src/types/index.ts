export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'UNCOMPLETED' | 'SUBMITTED' | 'CANCELLED' | 'STOPPED';
export type PaymentStatus = 'PENDING' | 'PROCESSED' | 'FAILED' | 'CANCELLED';
export type Role = 'ROLE_USER' | 'ROLE_ADMIN';
export type ActionType = 'START' | 'STOP' | 'CONTINUE' | 'COMPLETE' | 'SUBMIT' | 'CANCEL';

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
  nationalId?: string;
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
  nationalId: string;
  password?: string;
  workingDaysCount?: number;
  lastProductivityResetDate?: string;
  currentPeriodStartDate?: string;
  totalProductiveDays?: number;
  lastProductivityUpdate?: string;
  profilePictureThumbnailPath?: string;
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
  nationalId: string;
  totalHoursWorkedLast30Days?: number;
  suspensionDuration?: string;
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
  nationalId: string;
  profilePictureUrl?: string;
  profilePictureThumbnailUrl?: string;
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
  nationalId?: string;
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
  submitted?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskActionDTO {
  taskId: number;
  action: ActionType;
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
  isValidated?: boolean;
  validationTime?: string;
  submitted?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
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

export interface SalaryReceiptDTO {
  receiptNumber: string;
  issueDate: string;
  employee: {
    id: number;
    name: string;
    department: string;
    employmentDate: string;
    position?: string;
  };
  salary: {
    amount: number;
    paymentDate: string;
    paymentReference: string;
    status: string;
    paymentMethod?: string;
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

export interface ProfilePictureUploadDTO {
  profilePicture: File;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface EmployeeInfoDTO {
  id: number;
  name: string;
  department: string;
  position?: string;
  employmentDate: string;
}

export interface SalaryInfoDTO {
  amount: number;
  paymentDate: string;
  paymentReference: string;
  status: string;
  paymentMethod?: string;
}

export interface TaskProductivityDTO {
  title: string;
  expectedHours: number;
  actualHours: number;
  completionRate: number;
  status: string;
}

export interface ProductivitySummaryDTO {
  totalExpectedHours: number;
  totalActualHours: number;
  overallProductivity: number;
  workingDays: number;
}