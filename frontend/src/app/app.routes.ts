import { Routes } from '@angular/router';
import { NearbyCompaniesComponent } from './pages/nearby-companies/nearby-companies.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
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
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
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
