import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ApiService } from "../../../core/api.service";
import * as BookingActions from './booking.actions';
import { catchError, map, mergeMap, of } from "rxjs";


@Injectable()

export class BookingEffects{
    constructor(private actions$: Actions, private api: ApiService){}

    createBooking$ = createEffect(()=>
        this.actions$.pipe(
            ofType(BookingActions.createBooking),
            mergeMap(({companyId, booking})=>
            this.api.CreateBooking(companyId, booking).pipe(
                map(booking => BookingActions.createBookingSuccess({booking})),
                catchError(error =>of(BookingActions.createBookingFailure({error})))
            ))
        )
    );

    loadBookings$ = createEffect(()=>
    this.actions$.pipe(
        ofType(BookingActions.loadCompanyBookings),
        mergeMap(({companyId})=>
        this.api.getBookingForCompany(companyId).pipe(
            map(bookings => BookingActions.loadCompanyBookingsSuccess({bookings})),
            catchError(error=> of(BookingActions.loadCompanyBookingsFailure({error})))
        ))
    ))
}