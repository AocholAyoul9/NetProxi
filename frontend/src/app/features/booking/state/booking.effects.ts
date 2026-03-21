import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BookingApiService } from '../services/booking.api';
import * as BookingActions from './booking.actions';
import { catchError, from, map, mergeMap, of } from 'rxjs';
import { Booking } from '../models/booking.model';
import * as ClientActions from '../../../shared/state/client/client.actions';

@Injectable()
export class BookingEffects {
  createBooking$;
  loadBookings$;

  constructor(private actions$: Actions, private api: BookingApiService) {
    this.createBooking$ = createEffect(() =>
      this.actions$.pipe(
        ofType(BookingActions.createBooking),
        mergeMap(({ companyId, booking }) =>
          this.api.createBooking(companyId, booking).pipe(
            mergeMap((response: any) => {
              const fullBooking: Booking = {
                ...response,
                startTime: new Date(response.startTime),
                endTime: new Date(response.endTime),
              };

              return from([
                BookingActions.createBookingSuccess({ booking: fullBooking }),
                ClientActions.loadClientReservations({ clientId: fullBooking.clientId }),
              ]);
            }),
            catchError((error) =>
              of(BookingActions.createBookingFailure({ error }))
            )
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
