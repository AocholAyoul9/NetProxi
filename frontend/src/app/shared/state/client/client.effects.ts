import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import * as ClientActions from './client.actions';
import * as AuthActions from '../auth/auth.actions';
import { ApiService } from '../../../core/api.service';
import { AuthService } from '../../../core/auth.service';
import {
  NearbyCompany,
  ClientDashboardStats,
} from '../../models/client.model';
import { Booking } from '../../models/booking.model';

@Injectable()
export class ClientEffects {
  loadClientReservations$;
  loadNearbyCompanies$;
  searchCompanies$;
  loadDashboardStats$;
  updateReservationStatus$;
  addReservationReview$;
  toggleFavoriteCompany$;
  loadClientProfileAfterLogin$;
  loadClientProfile$;
  constructor(
    private actions$: Actions,
    private api: ApiService,
    private authService: AuthService
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




    // ---------------- Load nearby companies ----------------
    this.loadNearbyCompanies$ = createEffect(() =>
      this.actions$.pipe(
        ofType(ClientActions.loadNearbyCompanies),
        mergeMap(({ location }) =>
          this.api
            .getNearByCompanies(location?.lat || 0, location?.lng || 0, 200)
            .pipe(
              map((companies: any[]) => {
                const nearby: NearbyCompany[] = companies.map((c) => ({
                  ...c,
                  isFavorite: false,
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

    // ---------------- Search companies ----------------
    this.searchCompanies$ = createEffect(() =>
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
    this.loadDashboardStats$ = createEffect(() =>
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
    this.updateReservationStatus$ = createEffect(() =>
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
    this.addReservationReview$ = createEffect(() =>
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
    this.toggleFavoriteCompany$ = createEffect(() =>
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
}
