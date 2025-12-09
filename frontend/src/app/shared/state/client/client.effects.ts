import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as ClientActions from './client.actions';
import { ClientReservation, NearbyCompany, ClientDashboardStats } from '../../models/client.model';

@Injectable()
export class ClientEffects {
  private apiUrl = 'api/client';

  constructor(
    private actions$: Actions,
    private http: HttpClient
  ) {}

  // Load client profile
  loadClientProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClientProfile),
      mergeMap(() =>
        this.http.get<any>(`${this.apiUrl}/profile`).pipe(
          map(profile => ClientActions.loadClientProfileSuccess({ profile })),
          catchError(error => of(ClientActions.loadClientProfileFailure({ error: error.message })))
        )
      )
    )
  );

  // Load client reservations
  loadClientReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadClientReservations),
      mergeMap(() =>
        this.http.get<ClientReservation[]>(`${this.apiUrl}/reservations`).pipe(
          map(reservations => ClientActions.loadClientReservationsSuccess({ reservations }))
        )
      )
    )
  );

  // Load nearby companies
  loadNearbyCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadNearbyCompanies),
      mergeMap(({ location }) => {
        let url = `${this.apiUrl}/nearby-companies`;
        if (location) {
          url += `?lat=${location.lat}&lng=${location.lng}`;
        }
        
        return this.http.get<NearbyCompany[]>(url).pipe(
          map(companies => ClientActions.loadNearbyCompaniesSuccess({ companies }))
        );
      })
    )
  );

  // Search companies by address
  searchCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.searchCompanies),
      mergeMap(({ query }) =>
        this.http.post<NearbyCompany[]>(`${this.apiUrl}/search`, { address: query }).pipe(
          map(results => ClientActions.searchCompaniesSuccess({ results }))
        )
      )
    )
  );

  // Load dashboard stats
  loadDashboardStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadDashboardStats),
      mergeMap(() =>
        this.http.get<ClientDashboardStats>(`${this.apiUrl}/stats`).pipe(
          map(stats => ClientActions.loadDashboardStatsSuccess({ stats }))
        )
      )
    )
  );

  // Update reservation status
  updateReservationStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.updateReservationStatus),
      mergeMap(({ reservationId, status, reason }) =>
        this.http.put(`${this.apiUrl}/reservations/${reservationId}/status`, { status, reason }).pipe(
          map(() => ClientActions.updateReservationStatusSuccess({ reservationId, status }))
        )
      )
    )
  );

  // Add review to reservation
  addReservationReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.addReservationReview),
      mergeMap(({ reservationId, rating, review }) =>
        this.http.post(`${this.apiUrl}/reservations/${reservationId}/review`, { rating, review }).pipe(
          map(() => ClientActions.addReservationReviewSuccess({ reservationId, rating, review }))
        )
      )
    )
  );

  // Toggle favorite company
  toggleFavoriteCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.toggleFavoriteCompany),
      mergeMap(({ companyId, isFavorite }) =>
        this.http.put(`${this.apiUrl}/companies/${companyId}/favorite`, { isFavorite }).pipe(
          map(() => ClientActions.toggleFavoriteCompanySuccess({ companyId, isFavorite }))
        )
      )
    )
  );
}