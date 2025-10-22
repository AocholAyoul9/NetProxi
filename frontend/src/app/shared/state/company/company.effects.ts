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

  constructor(
    private actions$: Actions,
    private api: ApiService
  ) {
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
            map(companies =>
              CompanyActions.loadNearbyCompaniesSuccess({ companies })
            ),
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
