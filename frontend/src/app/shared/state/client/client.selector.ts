// client.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from './client.reducer';

// Feature selector
export const selectClientState = createFeatureSelector<ClientState>('client');



export const selectReservations = createSelector(
  selectClientState,
  (state) => state.reservations
);


// Basic selectors
export const selectClientProfile = createSelector(
  selectClientState,
  (state) => state.profile
);

export const selectClientReservations = createSelector(
  selectClientState,
  (state) => state.reservations
);

export const selectNearbyCompanies = createSelector(
  selectClientState,
  (state) => state.nearbyCompanies
);

export const selectFavoriteCompanies = createSelector(
  selectClientState,
  (state) => state.favoriteCompanies
);

export const selectDashboardStats = createSelector(
  selectClientState,
  (state) => state.dashboardStats
);

export const selectClientLoading = createSelector(
  selectClientState,
  (state) => state.loading
);

export const selectClientError = createSelector(
  selectClientState,
  (state) => state.error
);

export const selectSearchResults = createSelector(
  selectClientState,
  (state) => state.searchResults
);

export const selectSearchQuery = createSelector(
  selectClientState,
  (state) => state.searchQuery
);

export const selectActiveTab = createSelector(
  selectClientState,
  (state) => state.activeTab
);

export const selectReservationFilter = createSelector(
  selectClientState,
  (state) => state.reservationFilter
);

export const selectPagination = createSelector(
  selectClientState,
  (state) => state.pagination
);

// 3️⃣ Derived selectors
export const selectUpcomingReservations = createSelector(
  selectClientReservations,
  (reservations) => {
    const now = new Date();
    return reservations
      .filter(r => new Date(r.startTime) >= now && r.status !== 'CANCELLED' && r.status !== 'COMPLETED')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }
);

export const selectRecentReservations = createSelector(
  selectClientReservations,
  (reservations) =>
    reservations
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, 5)
);

export const selectFilteredReservations = createSelector(
  selectClientReservations,
  selectReservationFilter,
  (reservations, filter) => {
    switch (filter) {
      case 'upcoming':
        return reservations.filter(r => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(r.status));
      case 'completed':
        return reservations.filter(r => r.status === 'COMPLETED');
      case 'cancelled':
        return reservations.filter(r => r.status === 'CANCELLED');
      default:
        return reservations;
    }
  }
);

export const selectPaginatedReservations = createSelector(
  selectFilteredReservations,
  selectPagination,
  (reservations, pagination) => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    return reservations.slice(startIndex, startIndex + pagination.itemsPerPage);
  }
);

export const selectTotalPages = createSelector(
  selectFilteredReservations,
  selectPagination,
  (reservations, pagination) => Math.ceil(reservations.length / pagination.itemsPerPage)
);

export const selectDisplayedCompanies = createSelector(
  selectNearbyCompanies,
  selectSearchResults,
  selectSearchQuery,
  (nearbyCompanies, searchResults, searchQuery) => searchQuery ? searchResults : nearbyCompanies
);

export const selectHasSearchResults = createSelector(
  selectSearchQuery,
  (query) => query.length > 0
);

// Selector for the latest booking created
export const selectLatestBooking = createSelector(
  selectClientReservations,
  (reservations) => {
    if (!reservations || reservations.length === 0) return null;
    return reservations.reduce((latest, current) =>
      new Date(current.startTime) > new Date(latest.startTime) ? current : latest
    );
  }
);

// Selector to check if a booking is being created
export const selectIsCreatingBooking = selectClientLoading;

// Selector for booking-related errors
export const selectBookingError = selectClientError;
