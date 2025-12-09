import { createFeature, createReducer, on } from '@ngrx/store';
import * as ClientActions from './client.actions';
import { ClientReservation, NearbyCompany, ClientDashboardStats, ClientProfile } from '../../models/client.model';

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
    totalItems: 0
  }
};

export const clientFeature = createFeature({
  name: 'client',
  reducer: createReducer(
    initialState,
    
    // Load actions
    on(ClientActions.loadClientProfile, (state) => ({
      ...state,
      loading: true
    })),
    on(ClientActions.loadClientProfileSuccess, (state, { profile }) => ({
      ...state,
      profile,
      loading: false
    })),
    on(ClientActions.loadClientProfileFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false
    })),
    
    // Reservations
    on(ClientActions.loadClientReservations, (state) => ({
      ...state,
      loading: true
    })),
    on(ClientActions.loadClientReservationsSuccess, (state, { reservations }) => ({
      ...state,
      reservations,
      pagination: {
        ...state.pagination,
        totalItems: reservations.length
      },
      loading: false
    })),
    
    // Nearby companies
    on(ClientActions.loadNearbyCompanies, (state) => ({
      ...state,
      loading: true
    })),
    on(ClientActions.loadNearbyCompaniesSuccess, (state, { companies }) => ({
      ...state,
      nearbyCompanies: companies,
      loading: false
    })),
    
    // Search companies
    on(ClientActions.searchCompanies, (state, { query }) => ({
      ...state,
      searchQuery: query,
      loading: true
    })),
    on(ClientActions.searchCompaniesSuccess, (state, { results }) => ({
      ...state,
      searchResults: results,
      loading: false
    })),
    
    // Dashboard stats
    on(ClientActions.loadDashboardStats, (state) => ({
      ...state,
      loading: true
    })),
    on(ClientActions.loadDashboardStatsSuccess, (state, { stats }) => ({
      ...state,
      dashboardStats: stats,
      loading: false
    })),
    
    // Update reservation status
    on(ClientActions.updateReservationStatus, (state) => ({
      ...state,
      loading: true
    })),
    on(ClientActions.updateReservationStatusSuccess, (state, { reservationId, status }) => ({
      ...state,
      reservations: state.reservations.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status } 
          : reservation
      ),
      loading: false
    })),
    
    // Add review
    on(ClientActions.addReservationReview, (state) => ({
      ...state,
      loading: true
    })),
    on(ClientActions.addReservationReviewSuccess, (state, { reservationId, rating, review }) => ({
      ...state,
      reservations: state.reservations.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, rating, review } 
          : reservation
      ),
      loading: false
    })),
    
    // Toggle favorite company
    on(ClientActions.toggleFavoriteCompanySuccess, (state, { companyId, isFavorite }) => ({
      ...state,
      nearbyCompanies: state.nearbyCompanies.map(company =>
        company.id === companyId
          ? { ...company, isFavorite }
          : company
      ),
      favoriteCompanies: isFavorite
        ? [...state.favoriteCompanies, state.nearbyCompanies.find(c => c.id === companyId)!]
        : state.favoriteCompanies.filter(c => c.id !== companyId)
    })),
    
    // UI actions
    on(ClientActions.setActiveTab, (state, { tab }) => ({
      ...state,
      activeTab: tab
    })),
    on(ClientActions.setReservationFilter, (state, { filter }) => ({
      ...state,
      reservationFilter: filter,
      pagination: {
        ...state.pagination,
        currentPage: 1
      }
    })),
    on(ClientActions.setPaginationPage, (state, { page }) => ({
      ...state,
      pagination: {
        ...state.pagination,
        currentPage: page
      }
    })),
    
    // Clear search
    on(ClientActions.clearSearchResults, (state) => ({
      ...state,
      searchResults: [],
      searchQuery: ''
    }))
  )
});

export const {
  name,
  reducer,
  selectClientState,
  selectProfile,
  selectReservations,
  selectNearbyCompanies,
  selectFavoriteCompanies,
  selectDashboardStats,
  selectLoading,
  selectError,
  selectSearchResults,
  selectSearchQuery,
  selectActiveTab,
  selectReservationFilter,
  selectPagination
} = clientFeature;