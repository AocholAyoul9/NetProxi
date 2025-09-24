import { createAction, props } from "@ngrx/store";
import { Booking } from "../../models/booking.model";

export const  createBooking = createAction('[Booking] Create Booking', props<{companyId: string, booking: Partial<Booking>}>());
export const createBookingSuccess = createAction('[Booking] Create Booking success', props<{booking: Booking}>());
export const createBookingFailure = createAction('[Booking] Create Booking Failure', props<{error: any}>());


export const loadCompanyBookings = createAction('[Booking] Load Company Bookings', props<{companyId: string}>());
export const loadCompanyBookingsSuccess = createAction('[Booking] Load Company Bookings Success', props<{bookings: Booking[]}>());
export const loadCompanyBookingsFailure = createAction('[Booking] Load Company Bookings Failure', props<{error: any}>())
