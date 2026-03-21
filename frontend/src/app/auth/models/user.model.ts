export type UserRole = 'client' | 'company' | 'employee' | 'super_admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
