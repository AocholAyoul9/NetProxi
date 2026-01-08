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
  startTime: string;
  endTime?: string;
  duration: number;
  address: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  description?: string;
  notes?: string;
  equipment?: string[];
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeNotification {
  id: string;
  employeeId: string;
  title: string;
  message: string;
  type: 'TASK_ASSIGNED' | 'TASK_UPDATED' | 'TASK_CANCELLED' | 'SCHEDULE_CHANGED' | 'SYSTEM' | 'URGENT';
  read: boolean;
  data?: any;
  createdAt: string;
}

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
  rating?: number;
  totalTasks: number;
  completedTasks: number;
  joinDate: string;
}

export interface EmployeeStats {
  todayTasks: number;
  upcomingTasks: number;
  completedTasks: number;
  completionRate: number;
  averageRating: number;
  totalEarnings: number;
  monthlyEarnings: number;
}