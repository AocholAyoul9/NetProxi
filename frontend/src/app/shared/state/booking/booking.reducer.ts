import { createReducer, on } from '@ngrx/store';
import * as BookingActions from './booking.actions';

import { Booking } from '../../models/booking.model';

export interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: any;
}

export const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

export const bookingReducer = createReducer(
  initialState,
  on(BookingActions.loadCompanyBookings, (state) => ({
    ...state,
    loading: true,
  })),
  on(BookingActions.loadCompanyBookingsSuccess, (state, { bookings }) => ({
    ...state,
    bookings,
    loading: false,
  })),
  on(BookingActions.loadCompanyBookingsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(BookingActions.createBooking, (state) => ({ ...state, loading: true })),
  on(BookingActions.createBookingSuccess, (state, { booking }) => ({
    ...state,
    booking,
    loading: false,
  })),
  on(BookingActions.createBookingFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
