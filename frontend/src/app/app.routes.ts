import { Routes } from '@angular/router';
import { NearbyCompaniesComponent } from './pages/nearby-companies/nearby-companies.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CompanyDetailComponent } from './pages/company-detail/company-detail.component';
import { CompanyAdminDashboardComponent } from './pages/company-admin-dashboard/company-admin-dashboard.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';
import { SignupModalComponent } from './components/signup-modal/signup-modal.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { AuthGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: NearbyCompaniesComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'company/:id', component: CompanyDetailComponent },
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
  {
    path: 'client-dashboard',
    component: ClientDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CLIENT'] },
  },
  {
    path: 'employee-dashboard',
    component: EmployeeDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_EMPLOYEE'] },
  },
  { path: '**', redirectTo: '' },
];
