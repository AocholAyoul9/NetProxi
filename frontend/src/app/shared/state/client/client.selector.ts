import { createSelector } from '@ngrx/store';
import * as fromClient from './client.state';

// Base selectors
export const selectClientState = fromClient.selectClientState;
export const selectProfile = fromClient.selectProfile;
export const selectReservations = fromClient.selectReservations;
export const selectNearbyCompanies = fromClient.selectNearbyCompanies;
export const selectFavoriteCompanies = fromClient.selectFavoriteCompanies;
export const selectDashboardStats = fromClient.selectDashboardStats;
export const selectLoading = fromClient.selectLoading;
export const selectError = fromClient.selectError;
export const selectSearchResults = fromClient.selectSearchResults;
export const selectSearchQuery = fromClient.selectSearchQuery;
export const selectActiveTab = fromClient.selectActiveTab;
export const selectReservationFilter = fromClient.selectReservationFilter;
export const selectPagination = fromClient.selectPagination;

// Derived selectors
export const selectUpcomingReservations = createSelector(
  selectReservations,
  (reservations) => {
    const now = new Date();
    return reservations
      .filter(r => 
        new Date(r.bookingDate) >= now && 
        r.status !== 'CANCELLED' && 
        r.status !== 'COMPLETED'
      )
      .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime());
  }
);

export const selectRecentReservations = createSelector(
  selectReservations,
  (reservations) => {
    return reservations
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
      .slice(0, 5);
  }
);

export const selectFilteredReservations = createSelector(
  selectReservations,
  selectReservationFilter,
  (reservations, filter) => {
    switch (filter) {
      case 'upcoming':
        return reservations.filter(r => 
          ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(r.status)
        );
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
  (reservations, pagination) => {
    return Math.ceil(reservations.length / pagination.itemsPerPage);
  }
);

export const selectDisplayedCompanies = createSelector(
  selectNearbyCompanies,
  selectSearchResults,
  selectSearchQuery,
  (nearbyCompanies, searchResults, searchQuery) => {
    return searchQuery ? searchResults : nearbyCompanies;
  }
);

export const selectHasSearchResults = createSelector(
  selectSearchQuery,
  (query) => query.length > 0
);