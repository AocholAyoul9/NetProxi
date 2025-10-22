import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { Store } from '@ngrx/store';
import * as CompanyActions from '../../shared/state/company/company.actions';
import * as CompanySelectors from '../../shared/state/company/company.selectors';

import { Company } from '../../shared/models/company.model';
import { ServiceModel } from '../../shared/models/service.model';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent {
  searchQuery = signal('');
  serviceFilter = signal('');
  lat = signal<number | null>(48.8566);
  lng = signal<number | null>(2.3522);
  allCompanies$: Observable<Company[]>;

  ngOnInit(): void {
   this.store.dispatch(CompanyActions.loadAllCompanies());
  }
  
  // Booking modal
  bookingCompany = signal<Company | null>(null);
  selectedService = signal<ServiceModel | null>(null);
  bookingSuccess = signal('');

  constructor(private store: Store) {

    this.allCompanies$ = this.store.select(CompanySelectors.selectAllCompanies);
  }


  filteredCompanies() {
   /* return this.allCompanies$().filter((c: { name: string; services: any[]; }) =>
      (!this.searchQuery() || c.name.toLowerCase().includes(this.searchQuery().toLowerCase())) &&
      (!this.serviceFilter() || c.services?.some(s => s.name === this.serviceFilter()))
    );*/

  }

  setServiceFilter(service: string) {
    this.serviceFilter.set(service);
  }

  openBooking(company: Company) {
    this.bookingCompany.set(company);
    this.selectedService.set(null);
    this.bookingSuccess.set('');
  }

  confirmBooking() {
    if (!this.bookingCompany() || !this.selectedService()) return;
    this.bookingSuccess.set(`Réservation confirmée pour ${this.bookingCompany()!.name} (${this.selectedService()!.name}) !`);
  }

  closeBooking() {
    this.bookingCompany.set(null);
    this.selectedService.set(null);
    this.bookingSuccess.set('');
  }
}
