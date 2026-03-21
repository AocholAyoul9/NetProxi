import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';

import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { NearbyCompany } from '../../shared/models/client.model';
import * as ClientSelectors from '../../shared/state/client/client.selector';
import * as ClientActions from '../../shared/state/client/client.actions';
import * as BookingActions from '../../../features/booking/state/booking.actions';

import { Booking, CreateBookingRequest } from '../../../features/booking/models/booking.model';

type TabType = 'overview' | 'reservations' | 'companies' | 'history';

interface DashboardTab {
  id: TabType;
  label: string;
  icon: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss'],
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  // Observables from store
  profile$: Observable<any | null>;
  reservations$: Observable<Booking[]>;
  paginatedReservations$: Observable<Booking[]>;
  nearbyCompanies$: Observable<NearbyCompany[]>;
  displayedCompanies$: Observable<NearbyCompany[]>;
  loading$: Observable<boolean>;
  activeTab$: Observable<TabType>;
  reservationFilter$: Observable<string>;
  hasSearchResults$: Observable<boolean>;
  searchQuery$: Observable<string>;



  // Derived data (NO store selectors)
upcomingReservationsLocal$!: Observable<Booking[]>;
completedReservationsLocal$!: Observable<Booking[]>;
cancelledReservationsLocal$!: Observable<Booking[]>;

dashboardStatsLocal$!: Observable<{
  upcoming: number;
  completed: number;
  cancelled: number;
  total: number;
  totalSpent: number;
}>;

  // Local state
  tabs: DashboardTab[] = [
    { id: 'overview', label: "Vue d'ensemble", icon: 'fas fa-home' },
    { id: 'reservations', label: 'Mes Réservations', icon: 'fas fa-calendar-check' },
    { id: 'companies', label: 'Entreprises', icon: 'fas fa-store' },
    { id: 'history', label: 'Historique', icon: 'fas fa-history' },
  ];

  currentClient: any | null = null;
  selectedDateTime: string = '';
  bookingAddress: string = '';

  // Forms
  searchForm: FormGroup;
  reviewForm: FormGroup;

  // Modals state
  isReviewModalOpen = false;
  isCancelModalOpen = false;
  selectedReservation: Booking | null = null;

  // Subscriptions
  private subscriptions = new Subscription();

  constructor(private store: Store, private fb: FormBuilder) {
    // Initialize forms
    this.searchForm = this.fb.group({
      address: ['', Validators.required],
    });

    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      review: ['', Validators.maxLength(500)],
    });

    // Select data from store
    this.profile$ = this.store.select(ClientSelectors.selectClientProfile);
    this.reservations$ = this.store.select(ClientSelectors.selectReservations);
 


    this.paginatedReservations$ = this.store.select(
      ClientSelectors.selectPaginatedReservations
    );
    this.nearbyCompanies$ = this.store.select(
      ClientSelectors.selectNearbyCompanies
    );
    this.displayedCompanies$ = this.store.select(
      ClientSelectors.selectDisplayedCompanies
    );

    this.loading$ = this.store.select(ClientSelectors.selectClientLoading);
    this.activeTab$ = this.store.select(ClientSelectors.selectActiveTab);
    this.reservationFilter$ = this.store.select(
      ClientSelectors.selectReservationFilter
    );
    this.hasSearchResults$ = this.store.select(
      ClientSelectors.selectHasSearchResults
    );
    this.searchQuery$ = this.store.select(ClientSelectors.selectSearchQuery);
  }

  ngOnInit(): void {
    // Load initial data
    this.store.dispatch(ClientActions.loadClientProfile());
    this.getUserLocation();

    // Load client reservations
    this.subscriptions.add(
      this.profile$.subscribe((profile) => {
        if (profile?.id) {
          this.currentClient = profile;
          this.store.dispatch(
            ClientActions.loadClientReservations({ clientId: profile.id })
          );
        }
      })
    );

    // Sync search query with form
    this.subscriptions.add(
      this.searchQuery$.subscribe((query) => {
        if (query) {
          this.searchForm.patchValue({ address: query });
        }
      })
    );


     //  UPCOMING
  this.upcomingReservationsLocal$ = this.reservations$.pipe(
    map(reservations =>
      reservations.filter(r =>
        r.status === 'PENDING' || r.status === 'CONFIRMED'
      )
    )
  );

  // COMPLETED
  this.completedReservationsLocal$ = this.reservations$.pipe(
    map(reservations =>
      reservations.filter(r => r.status === 'COMPLETED')
    )
  );

  // CANCELLED (optional)
  this.cancelledReservationsLocal$ = this.reservations$.pipe(
    map(reservations =>
      reservations.filter(r => r.status === 'CANCELLED')
    )
  );

  // DASHBOARD STATS
  this.dashboardStatsLocal$ = this.reservations$.pipe(
    map(reservations => {
      const upcoming = reservations.filter(r =>
        r.status === 'PENDING' || r.status === 'CONFIRMED'
      ).length;

      const completed = reservations.filter(r =>
        r.status === 'COMPLETED'
      ).length;

      const cancelled = reservations.filter(r =>
        r.status === 'CANCELLED'
      ).length;

      const totalSpent = reservations
        .filter(r => r.status === 'COMPLETED')
        .reduce((sum, r) => sum + (r.price || 0), 0);

      return {
        upcoming,
        completed,
        cancelled,
        total: reservations.length,
        totalSpent,
      };
    })
  );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // UI Actions
  setActiveTab(tab: TabType): void {
    this.store.dispatch(ClientActions.setActiveTab({ tab }));
  }

  setReservationFilter(
    filter: 'all' | 'upcoming' | 'completed' | 'cancelled'
  ): void {
    this.store.dispatch(ClientActions.setReservationFilter({ filter }));
  }

  // Location and Search
  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.store.dispatch(
            ClientActions.loadNearbyCompanies({
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
            })
          );
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  }

  onSearchAddress(): void {
    if (this.searchForm.valid) {
      const address = this.searchForm.get('address')?.value;
      this.store.dispatch(ClientActions.searchCompanies({ query: address }));
      this.setActiveTab('companies');
    }
  }

  useCurrentLocation(): void {
    this.getUserLocation();
    this.searchForm.patchValue({ address: 'Ma position actuelle' });
    this.setActiveTab('companies');
  }

  clearSearch(): void {
    this.store.dispatch(ClientActions.clearSearchResults());
    this.searchForm.reset();
  }

  // Reservation Actions
  openReviewModal(reservation: Booking): void {
    this.selectedReservation = reservation;
    this.reviewForm.patchValue({
      rating: reservation.rating || 5,
      review: reservation.review || '',
    });
    this.isReviewModalOpen = true;
  }

  closeReviewModal(): void {
    this.isReviewModalOpen = false;
    this.selectedReservation = null;
    this.reviewForm.reset({ rating: 5, review: '' });
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.selectedReservation) {
      const { rating, review } = this.reviewForm.value;
      this.store.dispatch(
        ClientActions.addReservationReview({
          reservationId: this.selectedReservation.id,
          rating,
          review,
        })
      );
      this.closeReviewModal();
    }
  }

  openCancelModal(reservation: Booking): void {
    this.selectedReservation = reservation;
    this.isCancelModalOpen = true;
  }

  closeCancelModal(): void {
    this.isCancelModalOpen = false;
    this.selectedReservation = null;
  }

  cancelReservation(): void {
    if (this.selectedReservation) {
      this.store.dispatch(
        ClientActions.updateReservationStatus({
          reservationId: this.selectedReservation.id,
          status: 'CANCELLED',
        })
      );
      this.closeCancelModal();
    }
  }

  // Utility Methods
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'En attente',
      CONFIRMED: 'Confirmée',
      IN_PROGRESS: 'En cours',
      COMPLETED: 'Terminée',
      CANCELLED: 'Annulée',
    };
    return labels[status] || status;
  }

  formatCurrency(amount: number = 0): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  // Signals for booking modal
  bookingCompany = signal<NearbyCompany | null>(null);
  selectedService = signal<Service | null>(null);
  bookingSuccess = signal<string | null>(null);

  // Method to open booking modal
  openBookingModal(company: NearbyCompany): void {
    this.bookingCompany.set(company);
    this.selectedService.set(null);
    this.selectedDateTime = '';
    this.bookingAddress = '';
    this.bookingSuccess.set(null);
  }

  // Method to handle service selection in modal
  onServiceSelect(serviceId: string): void {
    const company = this.bookingCompany();
    if (company) {
      const service = company.services.find((s) => s.id === serviceId);
      this.selectedService.set(service || null);
    }
  }

  // Method to close booking modal
  closeBooking(): void {
    this.bookingCompany.set(null);
    this.selectedService.set(null);
    this.bookingSuccess.set(null);
  }

  getInitials(companyName: string): string {
    if (!companyName) return 'N';
    return companyName
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Method to confirm booking
  confirmBooking() {
    if (!this.currentClient || !this.selectedService() || !this.bookingCompany()) {
      console.error('Missing booking data');
      return;
    }

    const bookingRequest: CreateBookingRequest = {
      clientId: this.currentClient.id,
      serviceId: this.selectedService()!.id,
      companyId: this.bookingCompany()!.id,
      startTime: this.selectedDateTime,
      address: this.bookingAddress,
    };

    this.store.dispatch(
      BookingActions.createBooking({
        companyId: this.bookingCompany()!.id,
        booking: bookingRequest,
      })
    );

    // Show success message
    this.bookingSuccess.set('Votre réservation a été confirmée !');

    // Close modal after 3 seconds
    setTimeout(() => {
      this.closeBooking();
    }, 3000);
  }
}