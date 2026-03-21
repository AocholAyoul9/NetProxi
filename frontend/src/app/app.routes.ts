import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NearbyCompaniesComponent } from './pages/nearby-companies/nearby-companies.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CompanyAdminDashboardComponent } from './pages/company-admin-dashboard/company-admin-dashboard.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { SignupModalComponent } from './components/signup-modal/signup-modal.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { LoginPageComponent } from './auth/pages/login/login.component';
import { RegisterPageComponent } from './auth/pages/register/register.component';

export const routes: Routes = [
  { path: '', component: NearbyCompaniesComponent },
  {
    path: 'companies',
    loadChildren: () =>
      import('./features/companies/companies.routes').then(
        (m) => m.companiesRoutes
      ),
  },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'company/:id',
    loadComponent: () =>
      import('./features/companies/pages/company-detail/company-detail.component').then(
        (m) => m.CompanyDetailComponent
      ),
  },
  {
    path: 'company-admin',
    component: CompanyAdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_COMPANY', 'ROLE_COMPANY_ADMIN'] },
  },
  {
    path: 'super-admin',
    component: SuperAdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_SUPER_ADMIN'] },
  },
  { path: 'client-signup', component: SignupModalComponent },
  { path: 'client-dashboard', component: ClientDashboardComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  {
    path: 'employee-dashboard',
    component: EmployeeDashboardComponent,
  },
  { path: '**', redirectTo: '' },
];
