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