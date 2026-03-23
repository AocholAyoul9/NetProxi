import { createReducer, on } from '@ngrx/store';
import * as ClientActions from './client.actions';
import { NearbyCompany } from '../models/client.model';
import { ServiceModel } from '../../../shared/models/service.model';
import { Booking } from '../../booking/models/booking.model';

export interface ClientState {
  address: string;
  lat: number | null;
  lng: number | null;
  nearbyCompanies: NearbyCompany[];
  selectedCompany: NearbyCompany | null;
  selectedService: ServiceModel | null;
  bookingDate: Date | null;
  confirmedBooking: Booking | null;
  loading: boolean;
  error: any;
  // Additional properties needed by selectors
  reservations: Booking[];
  profile: any;
  favoriteCompanies: NearbyCompany[];
  searchResults: NearbyCompany[];
  searchQuery: string;
  activeTab: string;
  reservationFilter: string;
  pagination: {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

export const initialState: ClientState = {
  address: '',
  lat: null,
  lng: null,
  nearbyCompanies: [],
  selectedCompany: null,
  selectedService: null,
  bookingDate: null,
  confirmedBooking: null,
  loading: false,
  error: null,
  // Additional initial values
  reservations: [],
  profile: null,
  favoriteCompanies: [],
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

  on(ClientActions.registerClient, state => ({ ...state, loading: true })),
  on(ClientActions.registerClientSuccess, (state) => ({ ...state, loading: false })),
  on(ClientActions.registerClientFailure, (state, { error }) => ({ ...state, error, loading: false })),
  
  on(ClientActions.setAddress, (state, { address, lat, lng }) => ({
    ...state,
    address,
    lat,
    lng,
  })),
  on(ClientActions.loadNearbyCompanies, (state) => ({
    ...state,
    loading: true,
  })),
  on(ClientActions.loadNearbyCompaniesSuccess, (state, { companies }) => ({
    ...state,
    nearbyCompanies: companies,
    loading: false,
  })),
  on(ClientActions.loadNearbyCompaniesFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(ClientActions.selectCompany, (state, {company})=>({...state, selectedCompany: company})),
  on(ClientActions.selectService, (state, {service})=>({...state, selectedService: service})),
  on(ClientActions.setBookingDate, (state, {date})=>({...state, bookingDate: date})),
  on(ClientActions.confirmBooking, state => ({...state, loading: true})),
  on(ClientActions.confirmBookingSuccess, (state, {booking}) =>({...state, confirmedBooking: booking, loading: false })),
  on(ClientActions.confirmBookingFailure, (state, {error}) => ({...state, error, loading: false})),

  // Load client reservations
  on(ClientActions.loadClientReservations, state => ({ ...state, loading: true })),
  on(ClientActions.loadClientReservationsSuccess, (state, { reservations }) => ({ ...state, reservations, loading: false })),
  on(ClientActions.loadClientReservationsFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Load client profile
  on(ClientActions.loadClientProfile, state => ({ ...state, loading: true })),
  on(ClientActions.loadClientProfileSuccess, (state, { profile }) => ({ ...state, profile, loading: false })),
  on(ClientActions.loadClientProfileFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Search companies
  on(ClientActions.searchCompanies, state => ({ ...state, loading: true, searchQuery: '' })),
  on(ClientActions.searchCompaniesSuccess, (state, { results }) => ({ ...state, searchResults: results, loading: false })),
  on(ClientActions.searchCompaniesFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(ClientActions.clearSearchResults, state => ({ ...state, searchResults: [], searchQuery: '' })),

  // UI actions
  on(ClientActions.setActiveTab, (state, { tab }) => ({ ...state, activeTab: tab })),
  on(ClientActions.setReservationFilter, (state, { filter }) => ({ ...state, reservationFilter: filter })),
  on(ClientActions.setPaginationPage, (state, { page }) => ({ ...state, pagination: { ...state.pagination, currentPage: page } })),

  // Toggle favorite
  on(ClientActions.toggleFavoriteCompanySuccess, (state, { companyId, isFavorite }) => {
    const company = state.nearbyCompanies.find(c => (c as any).id === companyId);
    if (company) {
      const updatedCompany = { ...company, isFavorite };
      const updatedCompanies = state.nearbyCompanies.map(c => 
        (c as any).id === companyId ? updatedCompany : c
      );
      return { ...state, nearbyCompanies: updatedCompanies };
    }
    return state;
  })

);
