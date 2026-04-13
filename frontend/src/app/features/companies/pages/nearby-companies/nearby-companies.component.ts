import {
  Component,
  signal,
  ViewChildren,
  QueryList,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { FormsModule } from '@angular/forms';
import {
  Observable,
  Subject,
  debounceTime,
  takeUntil,
  forkJoin,
  of,
  switchMap,
  map,
} from 'rxjs';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

import * as CompanyActions from '../../state/company.actions';
import * as CompanySelectors from '../../state/company.selectors';
import { Company } from '../../models/company.model';
import { GeocodingService } from '../../services/geocoding.service';
import { CompaniesApiService } from '../../services/companies.api';

interface CompanyWithCoords extends Company {
  lat?: number;
  lng?: number;
  calculatedDistance?: number;
}

@Component({
  selector: 'app-nearby-companies',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, RouterLink, FormsModule],
  templateUrl: './nearby-companies.component.html',
  styleUrls: ['./nearby-companies.component.scss'],
})
export class NearbyCompaniesComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private geocoding = inject(GeocodingService);
  private api = inject(CompaniesApiService);
  private destroy$ = new Subject<void>();

  companies$: Observable<Company[]>;

  searchQuery = '';
  selectedCompany = signal<Company | null>(null);
  hoveredCompany = signal<Company | null>(null);
  mapCenter = signal<{ lat: number; lng: number }>({ lat: 45.764, lng: 4.8357 });
  sheetOpen = signal<boolean>(false);
  zoom = 12;

  bookingModalOpen = signal<boolean>(false);
  bookingCompany = signal<Company | null>(null);
  selectedService = signal<string>('');
  selectedDate = signal<string>('');
  selectedTime = signal<string>('');
  bookingSuccess = signal<boolean>(false);
  bookingLoading = signal<boolean>(false);

  private mapIdle$ = new Subject<google.maps.Map>();
  private searchSubject = new Subject<string>();
  private clusterer: MarkerClusterer | null = null;
  map: google.maps.Map | null = null;
  markers: Map<string, google.maps.Marker> = new Map();

  @ViewChildren('cardRef') cards!: QueryList<ElementRef>;

  currentCompanies: CompanyWithCoords[] = [];
  geolocationLoading = signal<boolean>(false);
  searchLoading = signal<boolean>(false);
  loading = signal<boolean>(false);

  private currentRadius = 10;

  constructor() {
    this.companies$ = this.store.select(
      CompanySelectors.selectAllCompanies
    );
  }

  ngOnInit() {
    this.loadCompaniesWithGeocoding(
      this.mapCenter().lat,
      this.mapCenter().lng,
      this.currentRadius
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.clusterer?.clearMarkers();
  }

  trackByCompanyId(index: number, company: Company): string {
    return company.id;
  }

  onSearchInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchSubject.next(query);
  }

  useMyLocation() {
    if (!navigator.geolocation) return;

    this.geolocationLoading.set(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.geolocationLoading.set(false);

        this.mapCenter.set({ lat: latitude, lng: longitude });

        this.loadCompaniesWithGeocoding(latitude, longitude, this.currentRadius);
      },
      () => {
        this.geolocationLoading.set(false);
      }
    );
  }

  highlightCompany(company: Company) {
    this.hoveredCompany.set(company);
  }

  clearHighlight() {
    this.hoveredCompany.set(null);
  }

  selectCompany(company: CompanyWithCoords, index: number) {
    this.selectedCompany.set(company);
    this.mapCenter.set({
      lat: company.lat ?? company.latitude ?? 0,
      lng: company.lng ?? company.longitude ?? 0,
    });
    this.scrollTo(index);
  }

  scrollTo(index: number) {
    setTimeout(() => {
      const el = this.cards.get(index);
      el?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);
  }

  selectFromMarker(company: CompanyWithCoords) {
    const index = this.currentCompanies.findIndex((c) => c.id === company.id);
    if (index === -1) return;

    this.selectedCompany.set(company);
    this.mapCenter.set({
      lat: company.lat ?? company.latitude ?? 0,
      lng: company.lng ?? company.longitude ?? 0,
    });
    this.scrollTo(index);
  }

  onMapIdle(map: google.maps.Map | undefined) {
    if (!map) return;
    this.map = map;
    this.mapIdle$.next(map);
  }

  onMapReady(map: google.maps.Map | undefined) {
    if (!map) return;
    this.map = map;
    this.clusterer = new MarkerClusterer({
      map,
      algorithmOptions: {
        maxZoom: 15,
      },
    });
    this.updateMarkers();
  }

  handleMapIdle(event: any) {
    this.onMapIdle(event as google.maps.Map);
  }

  handleMapReady(event: any) {
    this.onMapReady(event as google.maps.Map);
  }

  private updateMarkers() {
    if (!this.map || !this.clusterer) return;

    this.markers.forEach((marker) => marker.setMap(null));
    this.markers.clear();

    const googleMarkers: google.maps.Marker[] = [];

    for (const company of this.currentCompanies) {
      const lat = company.lat ?? company.latitude;
      const lng = company.lng ?? company.longitude;
      if (!lat || !lng) continue;

      const isSelected = this.selectedCompany()?.id === company.id;
      const isHovered = this.hoveredCompany()?.id === company.id;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: company.name || 'Company',
        icon: this.createMarkerIcon(company, isSelected, isHovered),
        zIndex: isSelected ? 1000 : 1,
      });

      marker.addListener('click', () => this.selectFromMarker(company));
      marker.addListener('mouseover', () => this.hoveredCompany.set(company));
      marker.addListener('mouseout', () => this.hoveredCompany.set(null));

      this.markers.set(company.id, marker);
      googleMarkers.push(marker);
    }

    this.clusterer?.addMarkers(googleMarkers);
  }

  private createMarkerIcon(
    company: CompanyWithCoords,
    isSelected: boolean,
    isHovered: boolean
  ): google.maps.Icon {
    const isAvailable = company.isAvailableNow ?? true;
    const rating = company.rating?.toFixed(1) || '4.5';

    let bgColor: string;
    if (isSelected) {
      bgColor = '#2563eb';
    } else if (!isAvailable) {
      bgColor = '#ef4444';
    } else if (isHovered) {
      bgColor = '#7c3aed';
    } else {
      bgColor = '#22c55e';
    }

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" fill="${bgColor}" stroke="white" stroke-width="2"/>
        <text x="20" y="25" text-anchor="middle" fill="white" font-size="10" font-family="system-ui" font-weight="600">
          ${rating}
        </text>
      </svg>
    `;

    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 20),
    };
  }

  toggleSheet() {
    this.sheetOpen.update((v) => !v);
  }

  closeSheet() {
    this.sheetOpen.set(false);
  }

  getInitials(name: string | null | undefined): string {
    if (!name) return '??';
    return name
      ?.split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '??';
  }

  formatDistance(m: number | undefined): string {
    if (!m) return '';
    return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
  }

  getFirstService(company: Company): string | null {
    if (!company.services?.length) return null;
    return company.services[0].name;
  }

  getExtraServicesCount(company: Company): number {
    if (!company.services) return 0;
    return Math.max(0, company.services.length - 1);
  }

  bookCompany(company: Company) {
    this.bookingCompany.set(company);
    this.selectedService.set(company.services?.[0]?.id || '');
    this.bookingSuccess.set(false);
    this.bookingModalOpen.set(true);
  }

  closeBookingModal() {
    this.bookingModalOpen.set(false);
    this.bookingCompany.set(null);
    this.selectedService.set('');
    this.selectedDate.set('');
    this.selectedTime.set('');
    this.bookingSuccess.set(false);
  }

  confirmBooking() {
    const company = this.bookingCompany();
    const serviceId = this.selectedService();

    if (!company || !serviceId || !this.selectedDate() || !this.selectedTime()) {
      return;
    }

    this.bookingLoading.set(true);

    const booking = {
      clientId: 'current-user',
      serviceId: serviceId,
      companyId: company.id,
      startTime: new Date(`${this.selectedDate()}T${this.selectedTime()}`).toISOString(),
      address: company.address || '',
    };

    setTimeout(() => {
      this.bookingLoading.set(false);
      this.bookingSuccess.set(true);
    }, 1000);
  }

  getServices(company: Company) {
    return company.services || [];
  }

  get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private loadCompaniesWithGeocoding(lat: number, lng: number, radiusKm: number) {
    this.loading.set(true);

    this.api.getCompanyAllCompanies().pipe(
      takeUntil(this.destroy$),
      switchMap((companies) => {
        const companiesWithCoords: CompanyWithCoords[] = [];
        const geocodeRequests: { company: Company; obs: Observable<{ lat: number; lng: number } | null> }[] = [];

        for (const company of companies) {
          if (company.latitude && company.longitude) {
            const dist = this.calculateDistance(lat, lng, company.latitude, company.longitude);
            if (dist <= radiusKm * 1000) {
              companiesWithCoords.push({
                ...company,
                lat: company.latitude,
                lng: company.longitude,
                calculatedDistance: dist,
                distance: dist
              });
            }
          } else if (company.address) {
            geocodeRequests.push({
              company,
              obs: this.geocoding.geocodeAddress(company.address)
            });
          }
        }

        if (geocodeRequests.length === 0) {
          return of(companiesWithCoords);
        }

        return forkJoin(geocodeRequests.map(r => r.obs)).pipe(
          map((coordsArray) => {
            coordsArray.forEach((coords, index) => {
              const company = geocodeRequests[index].company;
              if (coords) {
                const dist = this.calculateDistance(lat, lng, coords.lat, coords.lng);
                if (dist <= radiusKm * 1000) {
                  companiesWithCoords.push({
                    ...company,
                    lat: coords.lat,
                    lng: coords.lng,
                    calculatedDistance: dist,
                    distance: dist
                  });
                }
              }
            });
            return companiesWithCoords;
          })
        );
      })
    ).subscribe({
      next: (companies) => {
        this.currentCompanies = companies.sort((a, b) => (a.calculatedDistance || 0) - (b.calculatedDistance || 0));
        this.loading.set(false);
        this.updateMarkers();
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}