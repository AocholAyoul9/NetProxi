import { createReducer, on } from '@ngrx/store';
import * as ClientActions from '../client/client.actions';
import { Company } from '../../models/company.model';
import { ServiceModel } from '../../models/service.model';
import { Booking } from '../../models/booking.model';

export interface ClientState {
  address: string;
  lat: number | null;
  lng: number | null;
  nearbyCompanies: Company[];
  selectedCompany: Company | null;
  selectedService: ServiceModel | null;
  bookingDate: Date | null;
  confirmedBooking: Booking | null;
  loading: boolean;
  error: any;
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
};

export const clientReducer = createReducer(
  initialState,
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
  on(ClientActions.confirmBookingFailure, (state, {error}) => ({...state, error, loading: false}))

);
