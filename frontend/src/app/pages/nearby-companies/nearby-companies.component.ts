import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GoogleMapsModule } from '@angular/google-maps';
import * as CompanyActions from '../../shared/state/company/company.actions';
import * as CompanySelectors from '../../shared/state/company/company.selectors';
import { Company } from '../../shared/models/company.model';
import { getDistanceFromLatLonInKm } from '../../shared/utils';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-nearby-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './nearby-companies.component.html',
  styleUrls: ['./nearby-companies.component.scss'],
})
export class NearbyCompaniesComponent {
  address = signal('');
  lat = signal<number | null>(null);
  lng = signal<number | null>(null);
  radiusKm = signal(2000);

  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  companies$: Observable<Company[]>;



  constructor(private store: Store) {
    this.loading$ = this.store.select(CompanySelectors.selectCompanyLoading);
    this.error$ = this.store.select(CompanySelectors.selectCompanyError);
    this.companies$ = this.store.select(CompanySelectors.selectNearbyCompanies);

  }



  // Add properties
  popularServices = ['Bureaux', 'Vitres', 'Tapis', 'Entretien complet'];
  activeFilter: string | null = null;


async searchNearby() {
  const addr = this.address().trim();
  if (!addr) {
    console.warn('Address is empty.');
    return;
  }

  try {
    // Fetch geocoding data from Nominatim
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`
    );

    // Parse JSON response
    const data = await res.json();

    // Check if Nominatim returned anything
    if (!data || !data.length) {
      console.warn('No results from Nominatim for:', addr);
      //this.error$ = 'Adresse non trouvée.';
      return;
    }

    // Take the first (most relevant) result
    const first = data[0];
    const lat = parseFloat(first.lat);
    const lng = parseFloat(first.lon);

    // Optional: log for debugging
    console.log('Nominatim found:', first.display_name, 'lat:', lat, 'lng:', lng);

    // Set component observables or form values
    this.lat.set(lat);
    this.lng.set(lng);

    // Dispatch NgRx action to load nearby companies
    this.store.dispatch(
      CompanyActions.loadNearbyCompanies({
        lat,
        lng,
        radiusKm: this.radiusKm(), // make sure radiusKm() returns a number
      })
    );
  } catch (err: any) {
    console.error('Error searching nearby:', err);
    this.error$ = err.message || 'Erreur inattendue.';
  }
}


  bookCompany(_t57: Company) {
    throw new Error('Method not implemented.');
  }

  // Filter method
  filterByService(serviceName: string) {
    this.activeFilter = serviceName;
    this.companies$ = this.store.select(CompanySelectors.selectNearbyCompanies).pipe(
      map((companies) =>
        companies.filter((company) =>
          company.services?.some((s) => s.name === serviceName)
        )
      )
    );
  }

  // Clear filter method
  clearFilter() {
    this.activeFilter = null;
    if (!this.lat() || !this.lng()) return;
    this.searchNearby();
  }
}
