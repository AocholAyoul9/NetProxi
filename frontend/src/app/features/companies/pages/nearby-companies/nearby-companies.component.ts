import {
  Component,
  signal,
  ViewChildren,
  ViewChild,
  QueryList,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
  AfterViewInit,
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
  from,
  mergeMap,
  toArray,
} from 'rxjs';
import { GoogleMapsModule } from '@angular/google-maps';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

import * as CompanyActions from '../../state/company.actions';
import * as CompanySelectors from '../../state/company.selectors';
import { Company } from '../../models/company.model';
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
export class NearbyCompaniesComponent implements OnInit, OnDestroy, AfterViewInit {
  private store = inject(Store);
  private api = inject(CompaniesApiService);
  private destroy$ = new Subject<void>();

  // État
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
  bookingStep = signal<number>(1);
  
  bookingForm = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    propertyType: 'apartment',
    rooms: '2',
    surface: 0,
    notes: '',
  };

  // Carte et marqueurs
  private map: google.maps.Map | null = null;
  private clusterer: MarkerClusterer | null = null;
  private markers: Map<string, google.maps.Marker> = new Map();
  private infoWindows: Map<string, google.maps.InfoWindow> = new Map();
  private userLocationMarker: google.maps.Marker | null = null;

  // Données
  currentCompanies: CompanyWithCoords[] = [];
  geolocationLoading = signal<boolean>(false);
  loading = signal<boolean>(false);

  // Autocomplete
  addressSuggestions: google.maps.places.AutocompletePrediction[] = [];
  private autocompleteService: google.maps.places.AutocompleteService | null = null;
  private searchSubject = new Subject<string>();

  // Cache géocodage
  private geocodeCache = new Map<string, { lat: number; lng: number }>();
  
  // Store companies until map is ready
  private pendingCompanies: CompanyWithCoords[] = [];

  // Rayon de recherche (km)
  private currentRadius = 10;

  @ViewChildren('cardRef') cards!: QueryList<ElementRef>;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  constructor() {}

  ngOnInit() {
    // Attendre que l'API Places soit disponible (chargée via index.html)
    this.initPlacesService();
    this.setupSearchSubscription();

    // Chargement initial : géolocalisation ou centre par défaut
    this.loadInitialCompanies();
  }

  ngAfterViewInit() {
    // Initialize map manually once DOM is ready
    this.initMapManually();
    
    // Listen for button clicks from InfoWindow
    window.addEventListener('openBooking', ((e: CustomEvent) => {
      const companyId = e.detail;
      const company = this.currentCompanies.find(c => c.id === companyId);
      if (company) {
        this.bookCompany(company);
      }
    }) as EventListener);
    
    window.addEventListener('viewDetails', ((e: CustomEvent) => {
      const companyId = e.detail;
      // Navigate to company details (handled by router)
    }) as EventListener);
  }

  private initMapManually() {
    const checkGoogleMaps = setInterval(() => {
      if (typeof google !== 'undefined' && google.maps && this.mapContainer) {
        clearInterval(checkGoogleMaps);
        
        const mapEl = this.mapContainer.nativeElement;
        if (mapEl && !this.map) {
          console.log('Initializing map manually');
          this.map = new google.maps.Map(mapEl, {
            center: this.mapCenter(),
            zoom: this.zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
          
          this.clusterer = new MarkerClusterer({
            map: this.map,
            algorithmOptions: { maxZoom: 15 },
          });
          
          console.log('Map manually initialized');
          
          // Add markers if companies are already loaded
          if (this.currentCompanies.length > 0) {
            this.updateMarkers();
          }
        }
      }
    }, 100);
    
    setTimeout(() => clearInterval(checkGoogleMaps), 5000);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.closeAllInfoWindows();
    if (this.clusterer) {
      this.clusterer.clearMarkers();
    }
    if (this.userLocationMarker) {
      this.userLocationMarker.setMap(null);
    }
  }

  // ==================== INITIALISATION ====================

  private initPlacesService() {
    const checkInterval = setInterval(() => {
      if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        this.autocompleteService = new google.maps.places.AutocompleteService();
        clearInterval(checkInterval);
      }
    }, 100);
    setTimeout(() => clearInterval(checkInterval), 5000);
  }

  private setupSearchSubscription() {
    this.searchSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((query) => {
        if (query.length >= 3 && this.autocompleteService) {
          this.autocompleteService.getPlacePredictions(
            {
              input: query,
              componentRestrictions: { country: 'fr' },
            },
            (predictions, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                this.addressSuggestions = predictions;
              } else {
                this.addressSuggestions = [];
              }
            }
          );
        } else {
          this.addressSuggestions = [];
        }
      });
  }

  private loadInitialCompanies() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          this.mapCenter.set({ lat: latitude, lng: longitude });
          this.loadCompaniesWithGeocoding(latitude, longitude, this.currentRadius);
          this.reverseGeocodeAndSetQuery(latitude, longitude);
        },
        () => {
          // Échec : centre par défaut (Lyon)
          this.loadCompaniesWithGeocoding(45.764, 4.8357, this.currentRadius);
        }
      );
    } else {
      this.loadCompaniesWithGeocoding(45.764, 4.8357, this.currentRadius);
    }
  }

  // ==================== GÉOCODAGE DIRECT ====================

  private geocodeAddressDirect(address: string): Observable<{ lat: number; lng: number } | null> {
    // Vérifier le cache
    if (this.geocodeCache.has(address)) {
      return of(this.geocodeCache.get(address)!);
    }

    return new Observable((subscriber) => {
      if (typeof google === 'undefined' || !google.maps || !google.maps.Geocoder) {
        console.error('Google Maps Geocoder non disponible');
        subscriber.next(null);
        subscriber.complete();
        return;
      }

      const geocoder = new google.maps.Geocoder();
      const fullAddress = address.includes('France') ? address : `${address}, France`;

      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === 'OK' && results && results[0] && results[0].geometry) {
          const location = results[0].geometry.location;
          const coords = { lat: location.lat(), lng: location.lng() };
          this.geocodeCache.set(address, coords);
          subscriber.next(coords);
        } else {
          console.warn(`Géocodage échoué pour "${address}" : ${status}`);
          subscriber.next(null);
        }
        subscriber.complete();
      });
    });
  }

  private reverseGeocodeAndSetQuery(lat: number, lng: number) {
    if (typeof google === 'undefined' || !google.maps) return;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        this.searchQuery = results[0].formatted_address;
      } else {
        this.searchQuery = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      }
    });
  }

  // ==================== CHARGEMENT DES ENTREPRISES ====================

  private loadCompaniesWithGeocoding(lat: number, lng: number, radiusKm: number) {
    this.loading.set(true);
    console.log('Loading companies around', lat, lng, 'radius:', radiusKm, 'km');

    this.api.getNearByCompanies(lat, lng, radiusKm).pipe(takeUntil(this.destroy$)).subscribe({
      next: (companies) => {
        console.log('API returned', companies.length, 'nearby companies');
        
        const companiesWithCoords: CompanyWithCoords[] = companies
          .filter(c => c.latitude && c.longitude)
          .map(company => ({
            ...company,
            lat: company.latitude,
            lng: company.longitude,
            calculatedDistance: company.distance || 0,
            distance: company.distance,
          }));

        console.log('Companies with coords:', companiesWithCoords.length);
        companiesWithCoords.forEach(c => {
          console.log(`  ${c.name}: (${c.lat}, ${c.lng}) distance: ${c.distance}m`);
        });

        this.currentCompanies = companiesWithCoords.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        this.loading.set(false);
        this.updateMarkers();
      },
      error: (err) => {
        console.error('Error loading companies:', err);
        this.loading.set(false);
      },
    });
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // ==================== CARTE ET MARQUEURS ====================

  onMapReady(map: google.maps.Map | undefined) {
    if (!map) {
      console.warn('onMapReady called with undefined map');
      return;
    }
    this.map = map;
    this.clusterer = new MarkerClusterer({
      map,
      algorithmOptions: { maxZoom: 15 },
    });
    console.log('✅ onMapReady executed, map:', map.getCenter?.(), 'companies:', this.currentCompanies.length);
    
    // Add user location marker
    const center = map.getCenter();
    if (center) {
      this.addUserLocationMarker(center.lat(), center.lng());
    }
    
    // Force update markers when map becomes ready
    if (this.currentCompanies.length > 0) {
      this.updateMarkers();
    }
  }

  onMapIdle(map: google.maps.Map | undefined) {
    if (!map) return;
    this.map = map;
    
    // Also try to update markers when map becomes idle (backup if mapReady didn't fire properly)
    if (this.currentCompanies.length > 0 && this.markers.size === 0) {
      console.log('Map idle, trying to add markers');
      this.updateMarkers();
    }
  }

  handleMapReady(event: any) {
    console.log('handleMapReady called', event, typeof event);
    // The event might be the map object directly or wrapped
    if (event && typeof event === 'object') {
      if (event.getCenter) {
        // It's a Google Maps object
        this.onMapReady(event as google.maps.Map);
      } else if (event.map) {
        // It's wrapped in an object
        this.onMapReady(event.map as google.maps.Map);
      }
    }
  }

  handleMapIdle(event: any) {
    console.log('handleMapIdle called', event);
    if (event && typeof event === 'object' && event.getCenter) {
      this.onMapIdle(event as google.maps.Map);
    } else if (event && event.map) {
      this.onMapIdle(event.map as google.maps.Map);
    }
  }

private updateMarkers() {
    console.log('updateMarkers called', { 
      companiesCount: this.currentCompanies.length, 
      mapReady: !!this.map, 
      clustererReady: !!this.clusterer 
    });

    if (!this.map) {
      console.warn('updateMarkers: map not ready yet, storing companies for later');
      this.pendingCompanies = [...this.currentCompanies];
      return;
    }
    
    // Check if we have pending companies to add
    if (this.pendingCompanies.length > 0 && this.currentCompanies.length === 0) {
      console.log('Restoring pending companies to map');
      this.currentCompanies = this.pendingCompanies;
      this.pendingCompanies = [];
    }

    this.markers.forEach(m => m.setMap(null));
    this.markers.clear();

    if (this.clusterer) {
      this.clusterer.clearMarkers();
    }

    const googleMarkers: google.maps.Marker[] = [];

    for (const company of this.currentCompanies) {
      const lat = company.lat ?? company.latitude;
      const lng = company.lng ?? company.longitude;

      if (!lat || !lng) {
        console.warn(`Coordinates missing for ${company.name}`, company);
        continue;
      }

      const isSelected = this.selectedCompany()?.id === company.id;
      const isHovered = this.hoveredCompany()?.id === company.id;

      const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: this.map,
        title: company.name || 'Company',
        icon: this.createMarkerIcon(company, isSelected, isHovered),
        zIndex: isSelected ? 1000 : 1,
      });

      // Create InfoWindow content with company info
      const infoContent = this.createInfoWindowContent(company);
      const infoWindow = new google.maps.InfoWindow({
        content: infoContent,
        pixelOffset: new google.maps.Size(0, -40),
      });

      marker.addListener('click', () => {
        // Close any other open info windows
        this.closeAllInfoWindows();
        infoWindow.open(this.map, marker);
        this.selectFromMarker(company);
      });
      
      marker.addListener('mouseover', () => this.hoveredCompany.set(company));
      marker.addListener('mouseout', () => this.hoveredCompany.set(null));

      // Store the info window for later
      this.infoWindows.set(company.id, infoWindow);
      
      this.markers.set(company.id, marker);
      googleMarkers.push(marker);
      
      // Also add marker directly to map (backup if clusterer fails)
      marker.setMap(this.map);
    }

    if (this.clusterer && googleMarkers.length > 0) {
      this.clusterer.addMarkers(googleMarkers);
    }
    
    console.log(`Added ${googleMarkers.length} markers to map`);

    if (googleMarkers.length > 0 && this.map) {
      const bounds = new google.maps.LatLngBounds();
      googleMarkers.forEach(m => {
        const pos = m.getPosition();
        if (pos) bounds.extend(pos);
      });
      this.map.fitBounds(bounds);
    }
  }

  private createMarkerIcon(company: CompanyWithCoords, isSelected: boolean, isHovered: boolean): google.maps.Icon {
    const isAvailable = company.isAvailableNow ?? true;
    const rating = company.rating?.toFixed(1) || '4.5';

    let bgColor: string;
    if (isSelected) bgColor = '#2563eb';
    else if (!isAvailable) bgColor = '#ef4444';
    else if (isHovered) bgColor = '#7c3aed';
    else bgColor = '#22c55e';

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

  private createInfoWindowContent(company: CompanyWithCoords): string {
    const rating = company.rating?.toFixed(1) || '4.5';
    const distance = company.distance ? 
      (company.distance < 1000 ? `${Math.round(company.distance)}m` : `${(company.distance / 1000).toFixed(1)}km`) : '';
    
    // Store company ID in global object for button handlers
    (window as any).__companyActions = (window as any).__companyActions || {};
    (window as any).__companyActions[company.id] = { book: () => this.bookCompany(company), company };
    
    return `
      <div class="marker-info-window" style="min-width: 180px; padding: 6px 8px;">
        <div style="font-weight: 600; font-size: 13px; color: #1e293b; margin-bottom: 2px;">
          ${company.name}
        </div>
        <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
          ${rating} ⭐ ${distance ? ' • ' + distance : ''}
        </div>
        <div style="display: flex; gap: 6px;">
          <button 
            onclick="(window.__companyActions['${company.id}']||{}).book()"
            style="flex: 1; padding: 6px 10px; background: #2563eb; color: white; border: none; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer;">
            Réserver
          </button>
          <button 
            onclick="window.location.href='/company/${company.id}'"
            style="padding: 6px 10px; background: #f1f5f9; color: #475569; border: none; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer;">
            Détails
          </button>
        </div>
      </div>
    `;
  }

  private closeAllInfoWindows() {
    this.infoWindows.forEach(iw => iw.close());
  }

  private addUserLocationMarker(lat: number, lng: number) {
    if (!this.map) return;
    if (this.userLocationMarker) this.userLocationMarker.setMap(null);
    this.userLocationMarker = new google.maps.Marker({
      position: { lat, lng },
      map: this.map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#FFFFFF',
        strokeWeight: 3,
      },
      title: 'Votre position',
      zIndex: 1001,
    });
  }

  // ==================== INTERACTIONS UTILISATEUR ====================

  onSearchInput(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  onSearchFocus() {
    if (this.searchQuery.length >= 3 && this.addressSuggestions.length === 0 && this.autocompleteService) {
      this.searchSubject.next(this.searchQuery);
    }
  }

  clearSuggestions() {
    setTimeout(() => {
      this.addressSuggestions = [];
    }, 200);
  }

  selectAddressSuggestion(suggestion: google.maps.places.AutocompletePrediction) {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails({ placeId: suggestion.place_id }, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        this.mapCenter.set({ lat, lng });
        this.loadCompaniesWithGeocoding(lat, lng, this.currentRadius);
        this.searchQuery = suggestion.description;
        this.addressSuggestions = [];
      }
    });
  }

  useMyLocation() {
    if (!navigator.geolocation) return;
    this.geolocationLoading.set(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.mapCenter.set({ lat: latitude, lng: longitude });
        this.loadCompaniesWithGeocoding(latitude, longitude, this.currentRadius);
        this.addUserLocationMarker(latitude, longitude);
        this.reverseGeocodeAndSetQuery(latitude, longitude);
        this.geolocationLoading.set(false);
      },
      (error) => {
        console.error(error);
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

  selectFromMarker(company: CompanyWithCoords) {
    const index = this.currentCompanies.findIndex((c) => c.id === company.id);
    if (index !== -1) {
      this.selectCompany(company, index);
    }
  }

  private scrollTo(index: number) {
    setTimeout(() => {
      const el = this.cards.get(index);
      el?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  toggleSheet() {
    this.sheetOpen.update((v) => !v);
  }

  closeSheet() {
    this.sheetOpen.set(false);
  }

  // ==================== UTILITAIRES ====================

  getInitials(name: string | null | undefined): string {
    if (!name) return '??';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatDistance(m: number | undefined): string {
    if (!m) return '';
    return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
  }

  getFirstService(company: Company): string | null {
    return company.services?.length ? company.services[0].name : null;
  }

  getExtraServicesCount(company: Company): number {
    return company.services ? Math.max(0, company.services.length - 1) : 0;
  }

  trackByCompanyId(index: number, company: Company): string {
    return company.id;
  }

  // ==================== RÉSERVATION ====================

  bookCompany(company: Company) {
    this.bookingCompany.set(company);
    this.selectedService.set(company.services?.[0]?.id || '');
    this.bookingSuccess.set(false);
    this.bookingStep.set(1);
    this.bookingForm = {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      propertyType: 'apartment',
      rooms: '2',
      surface: 0,
      notes: '',
    };
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
    if (!company || !serviceId || !this.selectedDate() || !this.selectedTime()) return;

    this.bookingLoading.set(true);
    
    // Get or create client ID
    let clientId: string | null = localStorage.getItem('clientId');
    
    const createBooking = (cid: string) => {
      // Format date and time for backend (LocalDateTime)
      const dateStr = this.selectedDate(); // "2026-04-15"
      const timeStr = this.selectedTime(); // "14:00"
      const dateTimeStr = `${dateStr}T${timeStr}:00`;
      
      const bookingRequest = {
        clientId: cid,
        serviceId: serviceId,
        address: this.bookingForm.address,
        startTime: dateTimeStr,
        price: 0, // Will be set by backend based on service
      };
      
      console.log('Creating booking with:', bookingRequest);
      
      this.api.CreateBooking(company.id, bookingRequest).subscribe({
        next: (booking) => {
          console.log('Booking created:', booking);
          this.bookingLoading.set(false);
          this.bookingSuccess.set(true);
        },
        error: (err) => {
          console.error('Booking error:', err);
          this.bookingLoading.set(false);
          alert('Erreur lors de la réservation. Veuillez réessayer.');
        }
      });
    };
    
    if (clientId) {
      createBooking(clientId);
    } else {
      // Register client first
      const clientData = {
        name: this.bookingForm.fullName,
        email: this.bookingForm.email,
        password: 'TempPass123!', // Temporary password
        phone: this.bookingForm.phone,
        address: this.bookingForm.address,
      };
      
      this.api.registerClient(clientData).subscribe({
        next: (response) => {
          console.log('Client registered:', response);
          const newClientId = response.id;
          if (newClientId) {
            localStorage.setItem('clientId', newClientId);
            createBooking(newClientId);
          } else {
            this.bookingLoading.set(false);
            alert('Erreur lors de l\'inscription.');
          }
        },
        error: (err) => {
          console.error('Client registration error:', err);
          // Try to login instead
          this.api.loginClient(this.bookingForm.email, 'TempPass123!').subscribe({
            next: (loginRes) => {
              const loginClientId = loginRes.id;
              if (loginClientId) {
                localStorage.setItem('clientId', loginClientId);
                createBooking(loginClientId);
              } else {
                this.bookingLoading.set(false);
                alert('Erreur lors de la connexion.');
              }
            },
            error: (loginErr) => {
              console.error('Login error:', loginErr);
              this.bookingLoading.set(false);
              alert('Erreur. Veuillez réessayer.');
            }
          });
        }
      });
    }
  }

  nextBookingStep() {
    if (this.bookingStep() < 3) {
      this.bookingStep.update(s => s + 1);
    }
  }

  prevBookingStep() {
    if (this.bookingStep() > 1) {
      this.bookingStep.update(s => s - 1);
    }
  }

  getServiceName(serviceId: string): string {
    const company = this.bookingCompany();
    if (!company || !company.services) return '';
    const service = company.services.find(s => s.id === serviceId);
    return service ? service.name : '';
  }

  getServices(company: Company) {
    return company.services || [];
  }

  get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}