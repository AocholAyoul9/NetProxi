import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

interface ServiceModel {
  id: string;
  name: string;
}

interface Company {
  id: string;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  rating?: number;
  services?: ServiceModel[];
}

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
  companies = signal<Company[]>([]);
  
  // Booking modal
  bookingCompany = signal<Company | null>(null);
  selectedService = signal<ServiceModel | null>(null);
  bookingSuccess = signal('');

  constructor() {
    this.loadFakeCompanies();
  }

  loadFakeCompanies() {
    const fakeData: Company[] = [
      {
        id: '1',
        name: 'Nettoyage Pro',
        address: '12 Rue de Paris, 75001 Paris',
        phone: '01 23 45 67 89',
        latitude: 48.8566,
        longitude: 2.3522,
        rating: 4.5,
        services: [
          { id: 's1', name: 'Bureaux' },
          { id: 's2', name: 'Vitres' },
        ],
      },
      {
        id: '2',
        name: 'Éclat Clean',
        address: '34 Avenue des Champs, 75008 Paris',
        phone: '01 98 76 54 32',
        latitude: 48.8676,
        longitude: 2.3296,
        rating: 4.0,
        services: [
          { id: 's3', name: 'Tapis' },
          { id: 's4', name: 'Entretien complet' },
        ],
      },
      {
        id: '3',
        name: 'Brillance Nettoyage',
        address: '56 Boulevard Saint-Germain, 75005 Paris',
        phone: '01 11 22 33 44',
        latitude: 48.8527,
        longitude: 2.3506,
        rating: 5.0,
        services: [
          { id: 's5', name: 'Vitres' },
          { id: 's6', name: 'Entretien complet' },
        ],
      },
    ];

    this.companies.set(fakeData);
  }

  filteredCompanies() {
    return this.companies().filter(c =>
      (!this.searchQuery() || c.name.toLowerCase().includes(this.searchQuery().toLowerCase())) &&
      (!this.serviceFilter() || c.services?.some(s => s.name === this.serviceFilter()))
    );
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
