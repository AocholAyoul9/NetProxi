import { createAction, props } from '@ngrx/store';
import { 
  NearbyCompany, 
  ClientDashboardStats, 
  ClientProfile 
} from '../../models/client.model';
import { Booking } from '../../models/booking.model';


// Load client profile
export const loadClientProfile = createAction('[Client] Load Profile');
export const loadClientProfileSuccess = createAction(
  '[Client] Load Profile Success',
  props<{ profile: ClientProfile }>()
);
export const loadClientProfileFailure = createAction(
  '[Client] Load Profile Failure',
  props<{ error: string }>()
);

// Load client reservations
export const loadClientReservations = createAction('[Client] Load Reservations');
export const loadClientReservationsSuccess = createAction(
  '[Client] Load Reservations Success',
  props<{ reservations: Booking[] }>()
);

export const loadClientReservationsFailure = createAction(
  '[Client] Load Reservations Failure',
  props<{ error: string }>()
);

// Load nearby companies
export const loadNearbyCompanies = createAction(
  '[Client] Load Nearby Companies',
  props<{ location?: { lat: number; lng: number } }>()
);
export const loadNearbyCompaniesSuccess = createAction(
  '[Client] Load Nearby Companies Success',
  props<{ companies: NearbyCompany[] }>()
);

export const loadNearbyCompaniesFailure = createAction(
  '[Client] Load Nearby Companies Failure',
  props<{ error: string }>()
);
// Search companies by address
export const searchCompanies = createAction(
  '[Client] Search Companies',
  props<{ query: string }>()
);
export const searchCompaniesSuccess = createAction(
  '[Client] Search Companies Success',
  props<{ results: NearbyCompany[] }>()
);

export const searchCompaniesFailure = createAction(
  '[Client] Search Companies Failure',
  props<{ error: string }>()
);
export const clearSearchResults = createAction('[Client] Clear Search Results');

// Load dashboard statistics
export const loadDashboardStats = createAction('[Client] Load Dashboard Stats');
export const loadDashboardStatsSuccess = createAction(
  '[Client] Load Dashboard Stats Success',
  props<{ stats: ClientDashboardStats }>()
);

export const loadDashboardStatsFailure = createAction(
  '[Client] Load Dashboard Stats Failure',
  props<{ error: string }>()
);
// Update reservation status
export const updateReservationStatus = createAction(
  '[Client] Update Reservation Status',
  props<{ reservationId: string; status: string; reason?: string }>()
);
export const updateReservationStatusSuccess = createAction(
  '[Client] Update Reservation Status Success',
  props<{ reservationId: string; status: string }>()
);

export const updateReservationStatusFailure = createAction(
  '[Client] Update Reservation Status Failure',
  props<{ error: string }>()
);
// Add review to reservation
export const addReservationReview = createAction(
  '[Client] Add Reservation Review',
  props<{ reservationId: string; rating: number; review: string }>()
);
export const addReservationReviewSuccess = createAction(
  '[Client] Add Reservation Review Success',
  props<{ reservationId: string; rating: number; review: string }>()
);

export const addReservationReviewFailure = createAction(
  '[Client] Add Reservation Review Failure',
  props<{ error: string }>()
);
// Toggle favorite company
export const toggleFavoriteCompany = createAction(
  '[Client] Toggle Favorite Company',
  props<{ companyId: string; isFavorite: boolean }>()
);
export const toggleFavoriteCompanySuccess = createAction(
  '[Client] Toggle Favorite Company Success',
  props<{ companyId: string; isFavorite: boolean }>()
);

// UI actions
export const setActiveTab = createAction(
  '[Client] Set Active Tab',
  props<{ tab: 'overview' | 'reservations' | 'companies' | 'history' }>()
);
export const setReservationFilter = createAction(
  '[Client] Set Reservation Filter',
  props<{ filter: 'all' | 'upcoming' | 'completed' | 'cancelled' }>()
);
export const setPaginationPage = createAction(
  '[Client] Set Pagination Page',
  props<{ page: number }>()
);