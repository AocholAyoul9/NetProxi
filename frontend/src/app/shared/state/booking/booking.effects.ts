import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../../core/api.service';
import * as BookingActions from './booking.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Booking } from '../../models/booking.model';

@Injectable()
export class BookingEffects {
  createBooking$;
  loadBookings$;
  constructor(private actions$: Actions, private api: ApiService) {

this.createBooking$ = createEffect(() =>
  this.actions$.pipe(
    ofType(BookingActions.createBooking),
    mergeMap(({ companyId, booking }) =>
      this.api.CreateBooking(companyId, booking).pipe(
        map((response: any) => {
          // backend returns a full Booking
          const fullBooking: Booking = {
            ...response,
            startTime: new Date(response.startTime),
            endTime: new Date(response.endTime)
          };
          return BookingActions.createBookingSuccess({ booking: fullBooking });
        }),
        catchError((error) => of(BookingActions.createBookingFailure({ error })))
      )
    )
  )
);




    this.loadBookings$ = createEffect(() =>
      this.actions$.pipe(
        ofType(BookingActions.loadCompanyBookings),
        mergeMap(({ companyId }) =>
          this.api.getCompanyBookings(companyId).pipe(
            map((bookings) =>
              BookingActions.loadCompanyBookingsSuccess({ bookings })
            ),
            catchError((error) =>
              of(BookingActions.loadCompanyBookingsFailure({ error }))
            )
          )
        )
      )
    );
  }
}
