import { createFeature, createReducer, on } from '@ngrx/store';
import * as BookingActions from './booking.actions';
import { Booking } from '../models/booking.model';

export interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: any;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

export const bookingFeature = createFeature({
  name: 'booking' as const,
  reducer: createReducer(
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
      bookings: [...state.bookings, booking],
      loading: false,
    })),
    on(BookingActions.createBookingFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),
  ),
});

export const bookingReducer = bookingFeature.reducer;
