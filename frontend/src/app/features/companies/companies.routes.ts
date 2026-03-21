import { Routes } from '@angular/router';

export const companiesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/companies/companies.component').then(
        (m) => m.CompaniesComponent
      ),
  },
];
