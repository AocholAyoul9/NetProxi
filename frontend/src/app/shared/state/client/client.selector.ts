import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClientState } from './client.reducer';

export const selectClientState = createFeatureSelector<ClientState>('client');

export const selectAddress = createSelector(
  selectClientState,
  (state) => state.address
);
export const selectNearbyCompanies = createSelector(
  selectClientState,
  (state) => state.nearbyCompanies
);

export const selectSelectedCompany = createSelector(
  selectClientState,
  (state) => state.selectedCompany
);

export const selectSelectedService = createSelector(
  selectClientState,
  (state) => state.selectedService
);
export const selectBookingDate = createSelector(
  selectClientState,
  (state) => state.bookingDate
);

export const selectConfirmaingBooking = createSelector(
  selectClientState,
  (state) => state.confirmedBooking
);

export const selectClientLoading = createSelector(
  selectClientState,
  (state) => state.loading
);
