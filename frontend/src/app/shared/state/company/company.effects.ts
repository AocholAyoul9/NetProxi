import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ApiService } from '../../../core/api.service';
import * as CompanyActions from './company.actions';

@Injectable()
export class CompanyEffects {
  loadCompany$;
  loadNearbyCompanies$;
  loadAllCompanies$;
  loadCompanyServices$;
  loadCompanyBookings$;
  loadCompanyEmployees$;

  constructor(
    private actions$: Actions,
    private api: ApiService
  ) {


    this.loadCompanyEmployees$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.loadCompanyEmployees),
        mergeMap(({ companyId }) =>
          this.api.getCompanyEmployees(companyId).pipe(
            map(employees =>
              CompanyActions.loadCompanyEmployeesSuccess({ employees })
            ),
            catchError(error =>
              of(CompanyActions.loadCompanyEmployeesFailure({ error }))
            )
          )
        )
      )
    );
   
    this.loadCompanyBookings$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.loadCompanyBookings),
        mergeMap(({ companyId }) =>
          this.api.getCompanyBookings(companyId).pipe(
            map(bookings =>
              CompanyActions.loadCompanyBookingsSuccess({ bookings })
            ),
            catchError(error =>
              of(CompanyActions.loadCompanyBookingsFailure({ error }))
            )
          )
        )
      )
    );
    this.loadCompanyServices$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.loadCompanyServices),
        mergeMap(({ companyId }) =>
          this.api.getCompanyService(companyId).pipe(
            map(services =>
              CompanyActions.loadCompanyServicesSuccess({ services })
            ),
            catchError(error =>
              of(CompanyActions.loadCompanyServicesFailure({ error }))
            )
          )
        )
      )
    );
    





    this.loadCompany$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.loadCompany),
        mergeMap(({ id }) =>
          this.api.getCompanyById(id).pipe(
            map(company =>
              CompanyActions.loadCompanySuccess({ company })
            ),
            catchError(error =>
              of(CompanyActions.loadCompanyFailure({ error }))
            )
          )
        )
      )
    );

    this.loadNearbyCompanies$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.loadNearbyCompanies),
        mergeMap(({ lat, lng, radiusKm }) =>
          this.api.getNearByCompanies(lat, lng, radiusKm).pipe(
            map(companies => {
              console.log('Nearby companies from API:', companies);
              return CompanyActions.loadNearbyCompaniesSuccess({ companies });
            }),
            catchError(error =>
              of(CompanyActions.loadNearbyCompaniesFailure({ error }))
            )
          )
        )
      )
    );

     this.loadAllCompanies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CompanyActions.loadAllCompanies),
      mergeMap(() =>
        this.api.getCompanyAllCompanies().pipe(
          map((companies) =>
            CompanyActions.loadAllCompaniesSuccess({ companies })
          ),
          catchError((error) =>
            of(CompanyActions.loadAllCompaniesFailure({ error: error.message }))
          )
        )
      )
    )
  );
  }
}
