import { Routes } from '@angular/router';
import { NearbyCompaniesComponent } from './pages/nearby-companies/nearby-companies.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

export const routes: Routes = [
  { path: '', component: NearbyCompaniesComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' },
];
