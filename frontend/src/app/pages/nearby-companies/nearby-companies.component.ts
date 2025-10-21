import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { ApiService } from '../../core/api.service';
import { Company, FAKE_COMPANIES } from '../../shared/models/company.model';
import { getDistanceFromLatLonInKm } from '../../shared/utils';

@Component({
  selector: 'app-nearby-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule],
  templateUrl: './nearby-companies.component.html',
  styleUrls: ['./nearby-companies.component.scss'],
})
export class NearbyCompaniesComponent {


   companies = signal<Company[]>([]);

  loadFakeCompanies() {
    this.companies.set(FAKE_COMPANIES);
  }
bookCompany(_t57: Company) {
throw new Error('Method not implemented.');
}
  address = signal('');
  lat = signal<number | null>(null);
  lng = signal<number | null>(null);
  radiusKm = signal(10);
  loading = signal(false);
  error = signal('');

  constructor(private api: ApiService) {}

  // Add properties
popularServices = ['Bureaux', 'Vitres', 'Tapis', 'Entretien complet'];
activeFilter: string | null = null;

// Filter method
filterByService(serviceName: string) {
  this.activeFilter = serviceName;

  if (!this.lat() || !this.lng()) return;

  this.loading.set(true);
  this.error.set('');

  this.api.getNearByCompanies(this.lat()!, this.lng()!, this.radiusKm()).subscribe({
    next: (res) => {
      // Filter companies by selected service
      const filtered = res.filter(company =>
        company.services?.some(s => s.name === serviceName)
      );
      this.companies.set(filtered);
      this.loading.set(false);
    },
    error: () => {
      this.error.set('Erreur lors du filtrage des entreprises.');
      this.loading.set(false);
    }
  });
}

// Clear filter method
clearFilter() {
  this.activeFilter = null;
  if (!this.lat() || !this.lng()) return;
  this.searchNearby(); // reload all companies
}

async searchNearby() {
  const addr = this.address().trim();
  if (!addr) return;

  this.loading.set(true);
  this.error.set('');

  try {
    // 🔍 Geocoding via OpenStreetMap
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`
    );
    const data = await res.json();

    if (!data.length) throw new Error('Adresse non trouvée.');

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    this.lat.set(lat);
    this.lng.set(lng);

    // Use fake companies and calculate distance
    let nearby = FAKE_COMPANIES.map(c => ({
      ...c,
      distance: getDistanceFromLatLonInKm(lat, lng, c.latitude ?? 0, c.longitude ?? 0)
    }))
    // Filter companies within radiusKm
    .filter(c => c.distance <= this.radiusKm());
    
    // Sort by distance ascending
    nearby = nearby.sort((a, b) => (a.distance! - b.distance!));

    this.companies.set(nearby);
    this.loading.set(false);

    if (nearby.length === 0) {
      this.error.set('Aucune entreprise trouvée à proximité.');
    }

  } catch (err: any) {
    this.error.set(err.message || 'Erreur inattendue.');
    this.loading.set(false);
  }
}
}
