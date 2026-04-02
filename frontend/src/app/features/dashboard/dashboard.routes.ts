import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const dashboardRoutes: Routes = [
  {
    path: 'client-dashboard',
    loadComponent: () =>
      import('./pages/client-dashboard/client-dashboard.component').then(
        (m) => m.ClientDashboardComponent
      ),
  },
  {
    path: 'company-admin-dashboard',
    loadComponent: () =>
      import('./pages/company-admin-dashboard/company-admin-dashboard.component').then(
        (m) => m.CompanyAdminDashboardComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_COMPANY', 'ROLE_COMPANY_ADMIN'] },
  },
  {
    path: 'super-admin-dashboard',
    loadComponent: () =>
      import('./pages/super-admin-dashboard/super-admin-dashboard.component').then(
        (m) => m.SuperAdminDashboardComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_SUPER_ADMIN'] },
  },
  {
    path: 'employee-dashboard',
    loadComponent: () =>
      import('./pages/employee-dashboard/employee-dashboard.component').then(
        (m) => m.EmployeeDashboardComponent
      ),
  },
];
