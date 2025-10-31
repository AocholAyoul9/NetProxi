import { Routes } from '@angular/router';
import { NearbyCompaniesComponent } from './pages/nearby-companies/nearby-companies.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import {CompanyDetailComponent} from './pages/company-detail/company-detail.component';
import { CompanyAdminDashboardComponent } from './pages/company-admin-dashboard/company-admin-dashboard.component';
import { SuperAdminDashboardComponent } from './pages/super-admin-dashboard/super-admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: NearbyCompaniesComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  {path: 'company/:id', component: CompanyDetailComponent},
  {path: 'company-admin', component: CompanyAdminDashboardComponent},
  {path: 'super-admin', component: SuperAdminDashboardComponent},
  { path: '**', redirectTo: '' },
];
