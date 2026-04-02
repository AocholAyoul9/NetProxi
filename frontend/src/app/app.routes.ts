import { Routes } from '@angular/router';



export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/companies/pages/nearby-companies/nearby-companies.component').then((m) => m.NearbyCompaniesComponent), pathMatch: 'full' },
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
  { path: 'client-signup', loadComponent: () => import('./features/auth/pages/register/register.component').then((m) => m.RegisterPageComponent) },
  { path: '', loadChildren: () => import('./features/auth/auth.routes').then((m) => m.authRoutes) },
  { path: '', loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.dashboardRoutes) },
  { path: '**', redirectTo: '' },
];
