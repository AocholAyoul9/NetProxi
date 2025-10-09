import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ApiService } from '../../../core/api.service';
import * as ClientActions from '../client/client.actions';

import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectClientState } from './client.selector';

@Injectable()
export class ClientEffects {
  constructor(
    private actions$: Actions,
    private api: ApiService,
    private store: Store
  ) {}


  loadNearbyCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ClientActions.loadNearbyCompanies),
      withLatestFrom(this.store.select(selectClientState)),
      switchMap(([_, clientState]) => {
        if (clientState.lat == null || clientState.lng == null) return of(ClientActions.loadNearbyCompaniesFailure({ error: 'No coordinates' }));
        return this.api.getNearByCompanies(clientState.lat, clientState.lng, 5).pipe(
          map(companies => ClientActions.loadNearbyCompaniesSuccess({ companies })),
          catchError(error => of(ClientActions.loadNearbyCompaniesFailure({ error })))
        );
      })
    )
  );

  confirmBooking$ = createEffect(()=>

    this.actions$.pipe(
        ofType(ClientActions.confirmBooking),
        withLatestFrom(this.store.select(selectClientState)),
        switchMap(([_, clientstate])=>{
            if(!clientstate.selectedCompany || !clientstate.selectedService || !clientstate.bookingDate )
                 return of(ClientActions.confirmBookingFailure({error: 'Incomplete booking info'}));

            const bookingPayload  ={
                serviceType: clientstate.selectedService.name,
                startTime: clientstate.bookingDate.toDateString(),
                endTime: clientstate.bookingDate.toDateString(),
                address: clientstate.address,
                price: clientstate.selectedService.price
            };


            return this.api.CreateBooking(clientstate.selectedCompany.id, bookingPayload).pipe(
                map(booking => ClientActions.confirmBookingSuccess({booking})),
                catchError(error => of(ClientActions.confirmBookingFailure({error})))
            )
        })
    )
)


}
