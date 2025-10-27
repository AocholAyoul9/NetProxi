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
  radiusKm = signal(10);

  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  companies$: Observable<Company[]>;

 ngOnInit(): void {
  this.store.dispatch(CompanyActions.loadAllCompanies());
}


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
    if (!addr) return;

    try {
      // Geocoding via OpenStreetMap
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          addr
        )}`
      );
      const data = await res.json();

      if (!data.length) throw new Error('Adresse non trouvée.');

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      this.lat.set(lat);
      this.lng.set(lng);

      this.store.dispatch(
        CompanyActions.loadNearbyCompanies({
          lat,
          lng,
          radiusKm: this.radiusKm(),
        })
      );
    } catch (err: any) {
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
