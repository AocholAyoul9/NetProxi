import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map } from 'rxjs';

import { ClientReservation,NearbyCompany } from '../../shared/models/client.model';
import * as ClientSelectors from '../../shared/state/client/client.selector';
import * as ClientActions from '../../shared/state/client/client.actions';

type TabType = 'overview' | 'reservations' | 'companies' | 'history';

interface DashboardTab {
  id: TabType;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit, OnDestroy {
  
  // Observables from store
  profile$: Observable<any | null>;
  reservations$: Observable<ClientReservation[]>;
  upcomingReservations$: Observable<ClientReservation[]>;
  recentReservations$: Observable<ClientReservation[]>;
  filteredReservations$: Observable<ClientReservation[]>;
  paginatedReservations$: Observable<ClientReservation[]>;
  nearbyCompanies$: Observable<NearbyCompany[]>;
  displayedCompanies$: Observable<NearbyCompany[]>;
  dashboardStats$: Observable<any | null>;
  loading$: Observable<boolean>;
  activeTab$: Observable<TabType>;
  reservationFilter$: Observable<string>;
  pagination$: Observable<any>;
  totalPages$: Observable<number>;
  hasSearchResults$: Observable<boolean>;
  searchQuery$: Observable<string>;

  // Local state
  tabs: DashboardTab[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: 'fas fa-home' },
    { id: 'reservations', label: 'Mes Réservations', icon: 'fas fa-calendar-check' },
    { id: 'companies', label: 'Entreprises', icon: 'fas fa-store' },
    { id: 'history', label: 'Historique', icon: 'fas fa-history' }
  ];

  // Forms
  searchForm: FormGroup;
  reviewForm: FormGroup;

  // Modals state
  isReviewModalOpen = false;
  isCancelModalOpen = false;
  selectedReservation: ClientReservation | null = null;
  cancelReason = '';

  // Subscriptions
  private subscriptions = new Subscription();

  constructor(
    private store: Store,
    private fb: FormBuilder
  ) {
    // Initialize forms
    this.searchForm = this.fb.group({
      address: ['', Validators.required]
    });

    this.reviewForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      review: ['', Validators.maxLength(500)]
    });

    // Select data from store
    this.profile$ = this.store.select(ClientSelectors.selectProfile);
    this.reservations$ = this.store.select(ClientSelectors.selectReservations);
    this.upcomingReservations$ = this.store.select(ClientSelectors.selectUpcomingReservations);
    this.recentReservations$ = this.store.select(ClientSelectors.selectRecentReservations);
    this.filteredReservations$ = this.store.select(ClientSelectors.selectFilteredReservations);
    this.paginatedReservations$ = this.store.select(ClientSelectors.selectPaginatedReservations);
    this.nearbyCompanies$ = this.store.select(ClientSelectors.selectNearbyCompanies);
    this.displayedCompanies$ = this.store.select(ClientSelectors.selectDisplayedCompanies);
    this.dashboardStats$ = this.store.select(ClientSelectors.selectDashboardStats);
    this.loading$ = this.store.select(ClientSelectors.selectLoading);
    this.activeTab$ = this.store.select(ClientSelectors.selectActiveTab);
    this.reservationFilter$ = this.store.select(ClientSelectors.selectReservationFilter);
    this.pagination$ = this.store.select(ClientSelectors.selectPagination);
    this.totalPages$ = this.store.select(ClientSelectors.selectTotalPages);
    this.hasSearchResults$ = this.store.select(ClientSelectors.selectHasSearchResults);
    this.searchQuery$ = this.store.select(ClientSelectors.selectSearchQuery);
  }

  ngOnInit(): void {
    // Load initial data
    this.store.dispatch(ClientActions.loadClientProfile());
    this.store.dispatch(ClientActions.loadClientReservations());
    this.store.dispatch(ClientActions.loadDashboardStats());
    this.getUserLocation();

    // Subscribe to search query changes
    this.subscriptions.add(
      this.searchQuery$.subscribe(query => {
        if (query) {
          this.searchForm.patchValue({ address: query });
        }
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

  setReservationFilter(filter: 'all' | 'upcoming' | 'completed' | 'cancelled'): void {
    this.store.dispatch(ClientActions.setReservationFilter({ filter }));
  }

  setPaginationPage(page: number): void {
    this.store.dispatch(ClientActions.setPaginationPage({ page }));
  }

  // Location and Search
  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.store.dispatch(ClientActions.loadNearbyCompanies({
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
        },
        (error) => {
          console.error('Geolocation error:', error);
         // this.store.dispatch(ClientActions.loadNearbyCompanies());
        }
      );
    } else {
      //this.store.dispatch(ClientActions.loadNearbyCompanies());
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
  openReviewModal(reservation: ClientReservation): void {
    this.selectedReservation = reservation;
    this.reviewForm.patchValue({
      rating: reservation.rating || 5,
      review: reservation.review || ''
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
      this.store.dispatch(ClientActions.addReservationReview({
        reservationId: this.selectedReservation.id,
        rating,
        review
      }));
      this.closeReviewModal();
    }
  }

  openCancelModal(reservation: ClientReservation): void {
    this.selectedReservation = reservation;
    this.cancelReason = '';
    this.isCancelModalOpen = true;
  }

  closeCancelModal(): void {
    this.isCancelModalOpen = false;
    this.selectedReservation = null;
    this.cancelReason = '';
  }

  cancelReservation(): void {
    if (this.selectedReservation) {
      this.store.dispatch(ClientActions.updateReservationStatus({
        reservationId: this.selectedReservation.id,
        status: 'CANCELLED',
        reason: this.cancelReason
      }));
      this.closeCancelModal();
    }
  }

  // Company Actions
  toggleFavoriteCompany(companyId: string, isFavorite: boolean): void {
    this.store.dispatch(ClientActions.toggleFavoriteCompany({ companyId, isFavorite }));
  }

  // Utility Methods
  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'En attente',
      'CONFIRMED': 'Confirmée',
      'IN_PROGRESS': 'En cours',
      'COMPLETED': 'Terminée',
      'CANCELLED': 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'PENDING': 'warning',
      'CONFIRMED': 'info',
      'IN_PROGRESS': 'primary',
      'COMPLETED': 'success',
      'CANCELLED': 'danger'
    };
    return colors[status] || 'secondary';
  }

  calculateTimeUntilBooking(bookingDate: Date): string {
    const now = new Date();
    const booking = new Date(bookingDate);
    const diffMs = booking.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours > 0) {
        return `Dans ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
      } else {
        return 'Aujourd\'hui';
      }
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  getStars(rating: number | undefined): number[] {
    return Array(5).fill(0).map((_, i) => i < (rating || 0) ? 1 : 0);
  }
}