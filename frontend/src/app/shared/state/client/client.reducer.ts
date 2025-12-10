// client.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as ClientActions from './client.actions';
import {
  ClientReservation,
  NearbyCompany,
  ClientDashboardStats,
  ClientProfile,
} from '../../models/client.model';

export interface ClientState {
  profile: ClientProfile | null;
  reservations: ClientReservation[];
  nearbyCompanies: NearbyCompany[];
  favoriteCompanies: NearbyCompany[];
  dashboardStats: ClientDashboardStats | null;
  loading: boolean;
  error: string | null;
  searchResults: NearbyCompany[];
  searchQuery: string;
  activeTab: 'overview' | 'reservations' | 'companies' | 'history';
  reservationFilter: 'all' | 'upcoming' | 'completed' | 'cancelled';
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

export const initialState: ClientState = {
  profile: null,
  reservations: [],
  nearbyCompanies: [],
  favoriteCompanies: [],
  dashboardStats: null,
  loading: false,
  error: null,
  searchResults: [],
  searchQuery: '',
  activeTab: 'overview',
  reservationFilter: 'all',
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  },
};

export const clientReducer = createReducer(
  initialState,

  // ---------------- Create Booking ----------------
  on(ClientActions.createBooking, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ClientActions.createBookingSuccess, (state, { reservation }) => ({
    ...state,
    loading: false,
    reservations: [...state.reservations, reservation],
    pagination: {
      ...state.pagination,
      totalItems: state.reservations.length + 1,
    },
  })),
  on(ClientActions.createBookingFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ---------------- Load Profile ----------------
  on(ClientActions.loadClientProfile, (state) => ({
    ...state,
    loading: true,
  })),
  on(ClientActions.loadClientProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(ClientActions.loadClientProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ---------------- Load Reservations ----------------
  on(ClientActions.loadClientReservations, (state) => ({
    ...state,
    loading: true,
  })),
  on(ClientActions.loadClientReservationsSuccess, (state, { reservations }) => ({
    ...state,
    reservations,
    pagination: {
      ...state.pagination,
      totalItems: reservations.length,
    },
    loading: false,
  })),
  on(ClientActions.loadClientReservationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ---------------- Nearby Companies ----------------
  on(ClientActions.loadNearbyCompanies, (state) => ({
    ...state,
    loading: true,
  })),
  on(ClientActions.loadNearbyCompaniesSuccess, (state, { companies }) => ({
    ...state,
    nearbyCompanies: companies,
    loading: false,
  })),
  on(ClientActions.loadNearbyCompaniesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ---------------- Search Companies ----------------
  on(ClientActions.searchCompanies, (state, { query }) => ({
    ...state,
    searchQuery: query,
    loading: true,
  })),
  on(ClientActions.searchCompaniesSuccess, (state, { results }) => ({
    ...state,
    searchResults: results,
    loading: false,
  })),
  on(ClientActions.searchCompaniesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ---------------- Dashboard Stats ----------------
  on(ClientActions.loadDashboardStats, (state) => ({
    ...state,
    loading: true,
  })),
  on(ClientActions.loadDashboardStatsSuccess, (state, { stats }) => ({
    ...state,
    dashboardStats: stats,
    loading: false,
  })),
  on(ClientActions.loadDashboardStatsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ---------------- Update Reservation Status ----------------
  on(ClientActions.updateReservationStatus, (state) => ({
    ...state,
    loading: true,
  })),
  on(ClientActions.updateReservationStatusSuccess, (state, { reservationId, status }) => ({
    ...state,
    reservations: state.reservations.map((reservation) =>
      reservation.id === reservationId ? { ...reservation, status } : reservation
    ),
    loading: false,
  })),
  on(ClientActions.updateReservationStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ---------------- Add Reservation Review ----------------
  on(ClientActions.addReservationReview, (state) => ({
    ...state,
    loading: true,
  })),
  on(ClientActions.addReservationReviewSuccess, (state, { reservationId, rating, review }) => ({
    ...state,
    reservations: state.reservations.map((reservation) =>
      reservation.id === reservationId ? { ...reservation, rating, review } : reservation
    ),
    loading: false,
  })),
  on(ClientActions.addReservationReviewFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ---------------- Toggle Favorite Company ----------------
  on(ClientActions.toggleFavoriteCompanySuccess, (state, { companyId, isFavorite }) => ({
    ...state,
    nearbyCompanies: state.nearbyCompanies.map((company) =>
      company.id === companyId ? { ...company, isFavorite } : company
    ),
    favoriteCompanies: isFavorite
      ? [...state.favoriteCompanies, state.nearbyCompanies.find((c) => c.id === companyId)!]
      : state.favoriteCompanies.filter((c) => c.id !== companyId),
  })),

  // ---------------- UI Actions ----------------
  on(ClientActions.setActiveTab, (state, { tab }) => ({
    ...state,
    activeTab: tab,
  })),
  on(ClientActions.setReservationFilter, (state, { filter }) => ({
    ...state,
    reservationFilter: filter,
    pagination: {
      ...state.pagination,
      currentPage: 1,
    },
  })),
  on(ClientActions.setPaginationPage, (state, { page }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      currentPage: page,
    },
  })),
  on(ClientActions.clearSearchResults, (state) => ({
    ...state,
    searchResults: [],
    searchQuery: '',
  }))
);
