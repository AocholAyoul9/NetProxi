import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GoogleMapsModule } from '@angular/google-maps';
import { Observable, map } from 'rxjs';

import * as CompanyActions from '../../shared/state/company/company.actions';
import * as CompanySelectors from '../../shared/state/company/company.selectors';
import {
  Company,
  ServiceResponseDto as ServiceModel,
} from '../../shared/models/company.model';

@Component({
  selector: 'app-nearby-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './nearby-companies.component.html',
  styleUrls: ['./nearby-companies.component.scss'],
})
export class NearbyCompaniesComponent implements OnInit {
  // Search signals
  address = signal('');
  lat = signal<number | null>(null);
  lng = signal<number | null>(null);
  radiusKm = signal(10); // Reduced radius for better UX

  // State observables
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  companies$: Observable<Company[]>;

  // Filter properties
  popularServices = ['Bureaux', 'Vitres', 'Tapis', 'Entretien complet'];
  activeFilter: string | null = null;

  // Booking modal signals
  bookingCompany = signal<Company | null>(null);
  selectedService = signal<ServiceModel | null>(null);
  bookingSuccess = signal('');

  constructor(private store: Store) {
    this.loading$ = this.store.select(CompanySelectors.selectCompanyLoading);
    this.error$ = this.store.select(CompanySelectors.selectCompanyError);
    this.companies$ = this.store.select(CompanySelectors.selectNearbyCompanies);
  }

  ngOnInit(): void {
    // Try to get user's current location on component initialization
    this.getCurrentLocation();
  }

  /**
   * Gets user's current location using browser geolocation API
   */
  private getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat.set(position.coords.latitude);
          this.lng.set(position.coords.longitude);

          // Reverse geocode to get address
          this.reverseGeocode(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.warn('Geolocation error:', error);
          // Fallback to Paris coordinates
          this.lat.set(48.8566);
          this.lng.set(2.3522);
          this.address.set('Paris, France');
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      // Fallback to Paris coordinates
      this.lat.set(48.8566);
      this.lng.set(2.3522);
      this.address.set('Paris, France');
    }
  }

  /**
   * Reverse geocode coordinates to get address
   */
  private async reverseGeocode(lat: number, lng: number): Promise<void> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data && data.display_name) {
        this.address.set(data.display_name);
      }
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
    }
  }

  /**
   * Handles address input changes
   */
  onAddressChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.address.set(input.value);
  }

  /**
   * Searches for nearby companies based on address
   */
  async searchNearby(): Promise<void> {
    const addr = this.address().trim();
    if (!addr) {
      console.warn('Address is empty.');
      return;
    }

    try {
      // Fetch geocoding data from Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addr
        )}`
      );

      // Parse JSON response
      const data = await res.json();

      // Check if Nominatim returned anything
      if (!data || !data.length) {
        console.warn('No results from Nominatim for:', addr);
        return;
      }

      // Take the first (most relevant) result
      const first = data[0];
      const lat = parseFloat(first.lat);
      const lng = parseFloat(first.lon);

      // Set component signals
      this.lat.set(lat);
      this.lng.set(lng);

      // Dispatch NgRx action to load nearby companies
      this.store.dispatch(
        CompanyActions.loadNearbyCompanies({
          lat,
          lng,
          radiusKm: this.radiusKm(),
        })
      );

      // Clear any active filters when performing new search
      this.clearFilter();
    } catch (err: any) {
      console.error('Error searching nearby:', err);
    }
  }

  /**
   * Gets appropriate icon for service type
   */
  getServiceIcon(serviceName: string): string {
    const iconMap: { [key: string]: string } = {
      Bureaux: 'fa-building',
      Vitres: 'fa-window-restore',
      Tapis: 'fa-rug',
      'Entretien complet': 'fa-home',
    };
    return iconMap[serviceName] || 'fa-tools';
  }

  /**
   * Filters companies by service type
   */
  filterByService(serviceName: string): void {
    this.activeFilter = serviceName;
    this.companies$ = this.store
      .select(CompanySelectors.selectNearbyCompanies)
      .pipe(
        map((companies) =>
          companies.filter((company) =>
            company.services?.some((s) => s.name === serviceName)
          )
        )
      );
  }

  /**
   * Clears active filter and resets to all companies
   */
  clearFilter(): void {
    this.activeFilter = null;
    this.companies$ = this.store.select(CompanySelectors.selectNearbyCompanies);

    // If we have coordinates, refresh the data
    if (this.lat() && this.lng()) {
      this.store.dispatch(
        CompanyActions.loadNearbyCompanies({
          lat: this.lat()!,
          lng: this.lng()!,
          radiusKm: this.radiusKm(),
        })
      );
    }
  }

  /**
   * Opens booking modal for a company
   */
  bookCompany(company: Company): void {
    this.bookingCompany.set(company);
    this.selectedService.set(null);
    this.bookingSuccess.set('');
  }

  /**
   * Views company details (placeholder for navigation)
   */
  viewDetails(company: Company): void {
    console.log('View details for company:', company);
    // Implement navigation to company details page
    // Example: this.router.navigate(['/company', company.id]);
  }

  /**
   * Handles service selection in booking modal
   */
  onServiceSelect(serviceName: string): void {
    if (!serviceName) {
      this.selectedService.set(null);
      return;
    }

    const company = this.bookingCompany();
    if (company?.services) {
      const selectedService = company.services.find(
        (s) => s.name === serviceName
      );
      this.selectedService.set(selectedService || null);
    }
  }

  /**
   * Confirms booking
   */
  confirmBooking(): void {
    if (!this.bookingCompany() || !this.selectedService()) return;

    const company = this.bookingCompany()!;
    const service = this.selectedService()!;

    // Here you would typically dispatch an action to create the booking
    this.bookingSuccess.set(
      `Réservation confirmée pour ${company.name} (${service.name}) ! Un email de confirmation vous a été envoyé.`
    );

    // Reset after success message
    setTimeout(() => {
      if (this.bookingSuccess()) {
        this.closeBooking();
      }
    }, 3000);
  }

  /**
   * Closes booking modal
   */
  closeBooking(): void {
    this.bookingCompany.set(null);
    this.selectedService.set(null);
    this.bookingSuccess.set('');
  }

  /**
   * Gets the number of companies for display
   */
  getCompaniesCount(companies: Company[] | null): number {
    return companies?.length || 0;
  }

  /**
   * Formats distance for display (meters to kilometers)
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }

  /**
   * Handles Enter key in search input
   */
  onSearchKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.searchNearby();
    }
  }
}
