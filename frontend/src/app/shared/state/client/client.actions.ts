import { createAction, props } from "@ngrx/store";
import { Company } from "../../models/company.model";
import { ServiceModel } from "../../models/service.model";
import { Booking } from "../../models/booking.model";


export const registerClient = createAction('[Client] Register Client', props<{name: string; email: string; password: string; phone: string; address: string}>());
export const registerClientSuccess = createAction('[Client] Register Client Success', props<{clientId: string}>());
export const registerClientFailure = createAction('[Client] Register Client Failure', props<{error: any}>());

export const loginClient = createAction('[Client] Login Client', props<{email: string; password: string}>());
export const loginClientSuccess = createAction('[Client] Login Client Success', props<{clientId: string}>());
export const loginClientFailure = createAction('[Client] Login Client Failure', props<{error: any}>());

export const setAddress = createAction('[Client] Set Address', props<{address: string; lat: number; lng: number}>());
export const loadNearbyCompanies = createAction('[Client] Load Nearby Companies');
export const loadNearbyCompaniesSuccess = createAction('[Client] Load Nearby Companies Success', props<{companies: Company[]}>());
export const loadNearbyCompaniesFailure = createAction('[Client] Load Nearby Companies Failure', props<{error: any}>());

export const selectCompany = createAction('[Client] Select Company', props<{company: Company}>());
export const selectService = createAction('[Client] Select Service', props<{service: ServiceModel}>());
export const setBookingDate = createAction('[Client] Set Booking Date', props<{date: Date}>());
export const  confirmBooking =createAction('[Client] Confirm Booking');
export const confirmBookingSuccess = createAction('[Client] Confirm Booking Success', props<{booking: Booking}>());
export const confirmBookingFailure = createAction('[Client] Confirm Booking Failure', props<{error: any}>());