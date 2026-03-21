export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  companyId: string;
  isActive?: boolean;
  role?: string; // e.g., 'cleaner', 'supervisor', 'manager'
  createdAt?: Date;
  updatedAt?: Date;
}

export interface EmployeeCreateModel {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  companyId: string;
  role?: string;
}

export interface EmployeeUpdateModel {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  isActive?: boolean;
}




// shared/models/employee.model.ts
export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatarUrl?: string;
  companyId: string;
  companyName: string;
  skills?: string[];
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  averageRating: number;
  isAvailable: boolean;
  joinDate: string;
}

export interface EmployeeTask {
  id: string;
  serviceName: string;
  serviceId: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  companyId: string;
  companyName: string;
  employeeId: string;
  employeeName?: string;
  startTime: string;
  endTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  duration: number;
  address: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description?: string;
  notes?: string;
  equipment?: string[];
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  rating?: number;
  review?: string;
  price?: number;
  paymentStatus?: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeNotification {
  id: string;
  employeeId: string;
  title: string;
  message: string;
  type: 'TASK_ASSIGNED' | 'TASK_UPDATED' | 'TASK_CANCELLED' | 'SCHEDULE_CHANGED' | 'SYSTEM' | 'URGENT' | 'REMINDER';
  read: boolean;
  data?: any;
  createdAt: string;
  actionUrl?: string;
}

export interface EmployeeStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  completionRate: number;
  averageRating: number;
  totalEarnings: number;
  monthlyEarnings: number;
  period: string;
}

export interface EmployeeSchedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  serviceName: string;
  clientName: string;
  address: string;
}

// DTOs pour les requêtes
export interface UpdateEmployeeProfileDto {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  skills?: string[];
  isAvailable?: boolean;
}

export interface UpdateTaskStatusDto {
  status: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface UpdateAvailabilityDto {
  isAvailable: boolean;
}
