import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as ClientActions from './client.actions';
import { ApiService } from '../../../core/api.service';
import { Booking } from '../../../shared/models/booking.model';
import {
  ClientReservation,
  NearbyCompany,
  ClientDashboardStats,
} from '../../models/client.model';
import { AuthService } from '../../../core/auth.service';

@Injectable()
export class ClientEffects {
  constructor(private actions$: Actions, private api: ApiService,  private authService: AuthService) {
      console.log("API service injected:", this.api);

  }



  /*  // ---------------- Load Client Profile ----------------
  loadClientProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClientProfile),
      mergeMap(() =>
        this.api.getClientProfile().pipe(
          map((profile: ClientProfile) => ClientActions.loadClientProfileSuccess({ profile })),
          catchError(error => of(ClientActions.loadClientProfileFailure({ error: error.message })))
        )
      )
    )
  );*/


  // ---------------- Create Booking ----------------
createBooking$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ClientActions.createBooking),
    mergeMap(({ companyId, booking }) =>
      this.api.CreateBooking(companyId, booking).pipe(
        map((createdBooking) =>
          ClientActions.createBookingSuccess({
            reservation: createdBooking // Matches ClientReservation now ✔
          })
        ),
        catchError((error) =>
          of(ClientActions.createBookingFailure({ error: error.message }))
        )
      )
    )
  )
);




// ---------------- Load client reservations ----------------
loadClientReservations$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ClientActions.loadClientReservations),
    mergeMap(() =>
      this.api.getClientReservations(this.authService.getClientId()).pipe(
        map((reservations: ClientReservation[]) =>
          ClientActions.loadClientReservationsSuccess({ reservations })
        ),
        catchError(error =>
          of(ClientActions.loadClientReservationsFailure({ error: error.message }))
        )
      )
    )
  )
);




  // ---------------- Load nearby companies ----------------
  loadNearbyCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadNearbyCompanies),
      mergeMap(({ location }) =>
        this.api
          .getNearByCompanies(location?.lat || 0, location?.lng || 0, 10)
          .pipe(
            map((companies: any[]) => {
              // Map Company[] to NearbyCompany[]
              const nearby: NearbyCompany[] = companies.map((c) => ({
                ...c,
                isFavorite: false, // default, replace with actual user data if available
              }));
              return ClientActions.loadNearbyCompaniesSuccess({
                companies: nearby,
              });
            }),
            catchError(() =>
              of(ClientActions.loadNearbyCompaniesSuccess({ companies: [] }))
            )
          )
      )
    )
  );

  // ---------------- Search companies by address ----------------
  searchCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.searchCompanies),
      mergeMap(({ query }) =>
        this.api.searchCompanies(query).pipe(
          map((companies: any[]) => {
            const nearby: NearbyCompany[] = companies.map((c) => ({
              ...c,
              isFavorite: false,
            }));
            return ClientActions.searchCompaniesSuccess({ results: nearby });
          }),
          catchError(() =>
            of(ClientActions.searchCompaniesSuccess({ results: [] }))
          )
        )
      )
    )
  );

  // ---------------- Load dashboard stats ----------------
  loadDashboardStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadDashboardStats),
      mergeMap(() =>
        this.api.getDashboardStats().pipe(
          map((stats: ClientDashboardStats) =>
            ClientActions.loadDashboardStatsSuccess({ stats })
          ),
          catchError(() =>
            of(
              ClientActions.loadDashboardStatsSuccess({
                stats: {} as ClientDashboardStats,
              })
            )
          )
        )
      )
    )
  );

  // ---------------- Update reservation status ----------------
  updateReservationStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateReservationStatus),
      mergeMap(({ reservationId, status }) =>
        this.api.updateReservationStatus(reservationId, status).pipe(
          map(() =>
            ClientActions.updateReservationStatusSuccess({
              reservationId,
              status,
            })
          ),
          catchError(() =>
            of(
              ClientActions.updateReservationStatusSuccess({
                reservationId,
                status,
              })
            )
          )
        )
      )
    )
  );

  // ---------------- Add reservation review ----------------
  addReservationReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.addReservationReview),
      mergeMap(({ reservationId, rating, review }) =>
        this.api.addReservationReview(reservationId, rating, review).pipe(
          map(() =>
            ClientActions.addReservationReviewSuccess({
              reservationId,
              rating,
              review,
            })
          ),
          catchError(() =>
            of(
              ClientActions.addReservationReviewSuccess({
                reservationId,
                rating,
                review,
              })
            )
          )
        )
      )
    )
  );

  // ---------------- Toggle favorite company ----------------
  toggleFavoriteCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.toggleFavoriteCompany),
      mergeMap(({ companyId, isFavorite }) =>
        this.api.updateFavoriteCompany(companyId, isFavorite).pipe(
          map(() =>
            ClientActions.toggleFavoriteCompanySuccess({
              companyId,
              isFavorite,
            })
          ),
          catchError(() =>
            of(
              ClientActions.toggleFavoriteCompanySuccess({
                companyId,
                isFavorite,
              })
            )
          )
        )
      )
    )
  );
}
