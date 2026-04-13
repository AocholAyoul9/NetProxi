import {
  Component,
  signal,
  computed,
  OnDestroy,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  inject,
  afterNextRender,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GoogleMapsModule } from '@angular/google-maps';
import { Observable, map } from 'rxjs';
import { RouterLink } from '@angular/router';

import * as CompanyActions from '../../state/company.actions';
import * as CompanySelectors from '../../state/company.selectors';
import {
  Company,
  ServiceResponseDto as ServiceModel,
} from '../../models/company.model';

@Component({
  selector: 'app-nearby-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleMapsModule, RouterLink],
  templateUrl: './nearby-companies.component.html',
  styleUrls: ['./nearby-companies.component.scss'],
})
export class NearbyCompaniesComponent implements OnDestroy {
  // ── DI ──────────────────────────────────────────────────────────────
  private readonly store = inject(Store);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('searchInput') searchInputRef?: ElementRef<HTMLInputElement>;

  // ── Location signals ─────────────────────────────────────────────────
  readonly address = signal('');
  readonly lat = signal<number | null>(null);
  readonly lng = signal<number | null>(null);
  readonly radiusKm = signal(10);
  readonly radiusOptions = [5, 10, 20] as const;

  // ── Map state ────────────────────────────────────────────────────────
  readonly mapCenter = computed(() => ({
    lat: this.lat() ?? 48.8566,
    lng: this.lng() ?? 2.3522,
  }));
  readonly mapZoom = signal(12);
  readonly mapOptions = {
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    zoomControl: true,
  };

  // ── UI state ─────────────────────────────────────────────────────────
  readonly selectedCompanyId = signal<string | null>(null);
  readonly hoveredCompanyId = signal<string | null>(null);
  readonly isLocating = signal(false);

  // ── Filter ───────────────────────────────────────────────────────────
  readonly popularServices = ['Bureaux', 'Vitres', 'Tapis', 'Entretien complet'];
  activeFilter: string | null = null;

  // ── Booking modal ────────────────────────────────────────────────────
  selectedDateTime = '';
  bookingAddress = '';
  bookingEmail = '';
  readonly bookingCompany = signal<Company | null>(null);
  readonly selectedService = signal<ServiceModel | null>(null);
  readonly bookingSuccess = signal('');

  // ── NgRx observables ─────────────────────────────────────────────────
  readonly loading$: Observable<boolean> = this.store.select(
    CompanySelectors.selectCompanyLoading
  );
  readonly error$: Observable<string | null> = this.store.select(
    CompanySelectors.selectCompanyError
  );

  private readonly baseCompanies$: Observable<Company[]> = this.store
    .select(CompanySelectors.selectNearbyCompanies)
    .pipe(
      map((companies) =>
        [...companies].sort(
          (a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity)
        )
      )
    );

  viewCompanies$: Observable<Company[]> = this.baseCompanies$;

  // ── Autocomplete cleanup ─────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private autocompleteInstance: any = null;

  constructor() {
    afterNextRender(() => {
      this.triggerGeolocation();
      // Defer autocomplete init to give Google Maps script time to load
      setTimeout(() => this.initPlacesAutocomplete(), 500);
    });
  }

  ngOnDestroy(): void {
    if (this.autocompleteInstance) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).google?.maps?.event?.clearInstanceListeners(
        this.autocompleteInstance
      );
    }
  }

  // ── Geolocation ──────────────────────────────────────────────────────

  private triggerGeolocation(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!navigator.geolocation) {
      this.setDefaultLocation();
      return;
    }
    this.isLocating.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.lat.set(pos.coords.latitude);
        this.lng.set(pos.coords.longitude);
        this.mapZoom.set(13);
        this.isLocating.set(false);
        this.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
        this.dispatchNearbySearch();
      },
      () => {
        this.isLocating.set(false);
        this.setDefaultLocation();
      }
    );
  }

  useMyLocation(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.triggerGeolocation();
  }

  private setDefaultLocation(): void {
    this.lat.set(48.8566);
    this.lng.set(2.3522);
    this.address.set('Paris, France');
  }

  private async reverseGeocode(lat: number, lng: number): Promise<void> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data?.display_name) {
        this.address.set(data.display_name);
      }
    } catch {
      // silently ignore reverse-geocode failures
    }
  }

  // ── Places Autocomplete ──────────────────────────────────────────────

  private initPlacesAutocomplete(): void {
    if (!this.searchInputRef?.nativeElement) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (!win.google?.maps?.places) return;

    const autocomplete = new win.google.maps.places.Autocomplete(
      this.searchInputRef.nativeElement,
      { types: ['geocode'], fields: ['geometry', 'formatted_address'] }
    );
    this.autocompleteInstance = autocomplete;

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place?.geometry?.location) {
        this.lat.set(place.geometry.location.lat());
        this.lng.set(place.geometry.location.lng());
        this.address.set(place.formatted_address ?? '');
        this.mapZoom.set(13);
        this.clearFilter();
        this.dispatchNearbySearch();
      }
    });
  }

  // ── Search ────────────────────────────────────────────────────────────

  onAddressInput(event: Event): void {
    this.address.set((event.target as HTMLInputElement).value);
  }

  onSearchKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.searchByAddress();
  }

  async searchByAddress(): Promise<void> {
    const addr = this.address().trim();
    if (!addr) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}`
      );
      const data = await res.json();
      if (!data?.length) return;
      this.lat.set(parseFloat(data[0].lat));
      this.lng.set(parseFloat(data[0].lon));
      this.mapZoom.set(13);
      this.clearFilter();
      this.dispatchNearbySearch();
    } catch (err) {
      console.error('Geocoding error:', err);
    }
  }

  setRadius(km: number): void {
    this.radiusKm.set(km);
    if (this.lat() !== null && this.lng() !== null) {
      this.dispatchNearbySearch();
    }
  }

  private dispatchNearbySearch(): void {
    const lat = this.lat();
    const lng = this.lng();
    if (lat === null || lng === null) return;
    this.selectedCompanyId.set(null);
    this.store.dispatch(
      CompanyActions.loadNearbyCompanies({ lat, lng, radiusKm: this.radiusKm() })
    );
  }

  // ── Map / List sync ──────────────────────────────────────────────────

  onMarkerClick(company: Company): void {
    this.selectedCompanyId.set(company.id);
    if (isPlatformBrowser(this.platformId)) {
      document
        .getElementById(`company-${company.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  onCardClick(company: Company): void {
    this.selectedCompanyId.set(company.id);
    if (company.latitude != null && company.longitude != null) {
      this.lat.set(company.latitude);
      this.lng.set(company.longitude);
      this.mapZoom.set(15);
    }
  }

  onCardMouseEnter(company: Company): void {
    this.hoveredCompanyId.set(company.id);
  }

  onCardMouseLeave(): void {
    this.hoveredCompanyId.set(null);
  }

  getMarkerOptions(company: Company): { title: string; zIndex: number } {
    const isActive =
      this.selectedCompanyId() === company.id ||
      this.hoveredCompanyId() === company.id;
    return { title: company.name, zIndex: isActive ? 1000 : 1 };
  }

  // ── Filter ────────────────────────────────────────────────────────────

  filterByService(name: string): void {
    this.activeFilter = name;
    this.viewCompanies$ = this.baseCompanies$.pipe(
      map((companies) =>
        companies.filter((c) => c.services?.some((s) => s.name === name))
      )
    );
  }

  clearFilter(): void {
    this.activeFilter = null;
    this.viewCompanies$ = this.baseCompanies$;
  }

  // ── Display helpers ──────────────────────────────────────────────────

  formatDistance(km: number): string {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return `${km.toFixed(1)} km`;
  }

  getInitials(name: string): string {
    return (name || 'N')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getServiceIcon(name: string): string {
    const icons: Record<string, string> = {
      Bureaux: 'fa-building',
      Vitres: 'fa-window-restore',
      Tapis: 'fa-rug',
      'Entretien complet': 'fa-home',
    };
    return icons[name] ?? 'fa-tools';
  }

  // ── Booking ───────────────────────────────────────────────────────────

  bookCompany(company: Company): void {
    this.bookingCompany.set(company);
    this.selectedService.set(null);
    this.bookingSuccess.set('');
    this.bookingAddress = '';
    this.bookingEmail = '';
    this.selectedDateTime = '';
  }

  onServiceSelect(name: string): void {
    if (!name) {
      this.selectedService.set(null);
      return;
    }
    const service = this.bookingCompany()?.services?.find((s) => s.name === name);
    this.selectedService.set(service ?? null);
  }

  confirmBooking(): void {
    if (!this.bookingCompany() || !this.selectedService()) return;
    const company = this.bookingCompany()!;
    const service = this.selectedService()!;
    this.bookingSuccess.set(
      `Réservation confirmée pour ${company.name} (${service.name}) ! Un email de confirmation vous a été envoyé.`
    );
    setTimeout(() => {
      if (this.bookingSuccess()) this.closeBooking();
    }, 3000);
  }

  closeBooking(): void {
    this.bookingCompany.set(null);
    this.selectedService.set(null);
    this.bookingSuccess.set('');
  }
}
