import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as ClientActions from './client.actions';
import * as AuthActions from '../../../auth/store/auth.actions';
import { ApiService } from '../../../core/api.service';
import {
  NearbyCompany,
} from '../../models/client.model';
import { Booking } from '../../models/booking.model';

@Injectable()
export class ClientEffects {
  loadClientReservations$;
  loadNearbyCompanies$;
  searchCompanies$;
  updateReservationStatus$;
  addReservationReview$;
  toggleFavoriteCompany$;
  loadClientProfileAfterLogin$;
  loadClientProfile$;
  constructor(
    private actions$: Actions,
    private api: ApiService
  ) {
    this.loadClientProfileAfterLogin$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginClientSuccess),
        map(() => ClientActions.loadClientProfile())
      )
    );

    this.loadClientProfile$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ClientActions.loadClientProfile),
        mergeMap(() =>
          this.api.getClientProfile().pipe(
            map((profile) =>
              ClientActions.loadClientProfileSuccess({ profile })
            ),
            catchError((error) =>
              of(
                ClientActions.loadClientProfileFailure({ error: error.message })
              )
            )
          )
        )
      )
    );

// ---------------- Load client reservations ----------------
this.loadClientReservations$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ClientActions.loadClientReservations),
    mergeMap(({ clientId }) => {
      if (!clientId) {
        return of(
          ClientActions.loadClientReservationsFailure({
            error: 'Client ID not found',
          })
        );
      }

      return this.api.getClientReservations(clientId).pipe(
        map((reservations: Booking[]) =>
          ClientActions.loadClientReservationsSuccess({ reservations })
        ),
        catchError((error) =>
          of(
            ClientActions.loadClientReservationsFailure({
              error: error.message,
            })
          )
        )
      );
    })
  )
);






}
