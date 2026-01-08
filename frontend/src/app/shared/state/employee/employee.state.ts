import { EmployeeTask, EmployeeNotification, EmployeeProfile, EmployeeStats } from '../../models/employee.model';

export interface EmployeeState {
  profile: EmployeeProfile | null;
  tasks: EmployeeTask[];
  notifications: EmployeeNotification[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

export const initialEmployeeState: EmployeeState = {
  profile: null,
  tasks: [],
  notifications: [],
  loading: false,
  error: null,
  lastUpdated: null
};