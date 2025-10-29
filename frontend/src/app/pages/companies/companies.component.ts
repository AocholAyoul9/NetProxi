import { Component, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import * as CompanyActions from '../../shared/state/company/company.actions';
import * as CompanySelectors from '../../shared/state/company/company.selectors';

import {
  Company,
  ServiceResponseDto as ServiceModel,
  getPriceRange,
} from '../../shared/models/company.model';


@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
})
export class CompaniesComponent implements OnInit {
  // Search and filter signals
  searchQuery = signal('');
  serviceFilter = signal('');
  activeServiceFilter = signal('');
  
  // Location signals
  lat = signal<number | null>(48.8566);
  lng = signal<number | null>(2.3522);
  
  // Companies data
  allCompanies$: Observable<Company[]>;
  filteredCompanies$: Observable<Company[]>;

  // Booking modal signals
  bookingCompany = signal<Company | null>(null);
  selectedService = signal<ServiceModel | null>(null);
  bookingSuccess = signal('');

  constructor(private store: Store) {
    this.allCompanies$ = this.store.select(CompanySelectors.selectAllCompanies);
    
    // Create filtered companies observable
    this.filteredCompanies$ = this.createFilteredCompanies();
  }

  ngOnInit(): void {
    this.store.dispatch(CompanyActions.loadAllCompanies());
  }

  /**
   * Creates filtered companies observable based on search and service filters
   */
  private createFilteredCompanies(): Observable<Company[]> {
    return this.allCompanies$.pipe(
      map(companies => {
        const searchQuery = this.searchQuery().toLowerCase();
        const serviceFilter = this.serviceFilter();

        return companies.filter(company => {
          // Search filter
          const matchesSearch = !searchQuery || 
            company.name?.toLowerCase().includes(searchQuery) ||
            company.address?.toLowerCase().includes(searchQuery) ||
            company.description?.toLowerCase().includes(searchQuery);

          // Service filter
          const matchesService = !serviceFilter || 
            company.services?.some(service => 
              service.name?.toLowerCase() === serviceFilter.toLowerCase()
            );

          return matchesSearch && matchesService;
        });
      })
    );
  }

  /**
   * Gets price display for a company
   */
  getPriceDisplay(company: Company): string {
    return getPriceRange(company);
  }

  /**
   * Checks if company is available
   */
  isCompanyAvailable(company: Company): boolean {
    // You can implement more sophisticated real-time availability logic here
    return company.isAvailableNow ?? Math.random() > 0.3; // Random for demo
  }

  /**
   * Sets service filter and updates active filter
   */
  setServiceFilter(service: string) {
    this.serviceFilter.set(service);
    this.activeServiceFilter.set(service);
  }

  /**
   * Updates search query and triggers filtering
   */
  onSearchQueryChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  /**
   * Opens booking modal for a company
   */
  openBooking(company: Company) {
    this.bookingCompany.set(company);
    this.selectedService.set(null);
    this.bookingSuccess.set('');
  }

  /**
   * Navigates to company details page
   */
  viewDetails(company: Company) {
    // You can implement navigation to company details page here
    console.log('View details for company:', company);
    // Example: this.router.navigate(['/company', company.id]);
  }

  /**
   * Confirms booking
   */
  confirmBooking() {
    if (!this.bookingCompany() || !this.selectedService()) return;
    
    // Here you would typically dispatch an action to create the booking
    const company = this.bookingCompany()!;
    const service = this.selectedService()!;
    
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
  closeBooking() {
    this.bookingCompany.set(null);
    this.selectedService.set(null);
    this.bookingSuccess.set('');
  }

  /**
   * Gets the number of companies (for display)
   */
  getCompaniesCount(companies: Company[] | null): number {
    return companies?.length || 0;
  }

  /**
   * Handles service selection in modal
   */
  onServiceSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const serviceName = select.value;
    
    if (!serviceName) {
      this.selectedService.set(null);
      return;
    }

    const company = this.bookingCompany();
    if (company?.services) {
      const selectedService = company.services.find(s => s.name === serviceName);
      this.selectedService.set(selectedService || null);
    }
  }

  /**
   * Generates random distance for demo purposes
   */
  getRandomDistance(): number {
    return Math.random() * 10 + 0.1; // 0.1 to 10.1 km
  }

  /**
   * Formats distance for display
   */
  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  }
}