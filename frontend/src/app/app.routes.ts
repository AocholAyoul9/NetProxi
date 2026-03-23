import { Routes } from '@angular/router';
import { NearbyCompaniesComponent } from './features/companies/pages/nearby-companies/nearby-companies.component';

import { SignupModalComponent } from './components/signup-modal/signup-modal.component';


export const routes: Routes = [
  { path: '', component: NearbyCompaniesComponent, pathMatch: 'full' },
  {
    path: 'companies',
    loadChildren: () =>
      import('./features/companies/companies.routes').then(
        (m) => m.companiesRoutes
      ),
  },

  {
    path: 'company/:id',
    loadComponent: () =>
      import('./features/companies/pages/company-detail/company-detail.component').then(
        (m) => m.CompanyDetailComponent
      ),
  },
  { path: 'client-signup', component: SignupModalComponent },
  { path: '', loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes) },
  { path: '', loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes) },
  { path: '**', redirectTo: '' },
];
