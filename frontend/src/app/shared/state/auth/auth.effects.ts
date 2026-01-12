import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/auth.service';

import * as AuthActions from './auth.actions';
import * as CompanyActions from '../company/company.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Company } from '../../models/company.model';

@Injectable()
export class AuthEffects {
  loginCompany$;
  loginCompanySuccess$;
  registerCompany$;
  registerClient$;
  loginClient$;
  loginClientSuccess$;
  logoutCompany$;
  loadCompanyDataAfterLogin$;
  logoutClient$;

  loginEmployee$;
  loginEmployeeSuccess$;
  constructor(
    private action$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginCompany$ = createEffect(() =>
      this.action$.pipe(
        ofType(AuthActions.loginCompany),
        mergeMap(({ email, password }) =>
          this.authService.loginCompany(email, password).pipe(
            tap((res) => console.log('LOGIN RESPONSE =', res)),
            map((res) =>
              AuthActions.loginCompanySuccess({
                company: res, 
                token: res.token,
              })
            ),
            catchError((error) =>
              of(AuthActions.loginCompanyFailure({ error }))
            )
          )
        )
      )
    );

    this.loadCompanyDataAfterLogin$ = createEffect(() =>
      this.action$.pipe(
        ofType(AuthActions.loginCompanySuccess),
        mergeMap(({ company, token }) => [
          CompanyActions.loadCompany({ companyId: company.id }),
          CompanyActions.loadCompanyServices({ companyId: company.id }),
          CompanyActions.loadCompanyBookings({ companyId: company.id }),
          CompanyActions.loadCompanyEmployees({ companyId: company.id }),
        ])
      )
    );

    this.loginCompanySuccess$ = createEffect(
      () =>
        this.action$.pipe(
          ofType(AuthActions.loginCompanySuccess),
          tap(() => {
            this.router.navigate(['/company-admin']);
          })
        ),
      {
        dispatch: false,
      }
    );

    this.registerCompany$ = createEffect(() =>
      this.action$.pipe(
        ofType(AuthActions.registerCompany),
        mergeMap(({ company }) =>
          this.authService.registerCompany(company).pipe(
            map((newCompany) =>
              AuthActions.registerCompanySuccess({ company: newCompany })
            ),
            catchError((error) =>
              of(AuthActions.registerCompanyFailure({ error }))
            )
          )
        )
      )
    );

    this.registerClient$ = createEffect(() =>
      this.action$.pipe(
        ofType(AuthActions.registerClient),
        mergeMap(({ client }) =>
          this.authService.registerClient(client).pipe(
            map((newClient) =>
              AuthActions.registerClientSuccess({ client: newClient })
            ),
            catchError((error) =>
              of(AuthActions.registerClientFailure({ error }))
            )
          )
        )
      )
    );

    this.loginClient$ = createEffect(() =>
      this.action$.pipe(
        ofType(AuthActions.loginClient),
        mergeMap(({ email, password }) =>
          this.authService.loginClient(email, password).pipe(
            map((res) =>
              AuthActions.loginClientSuccess({
                client: res,
                token: res.token,
              })
            ),
            catchError((error) =>
              of(AuthActions.loginClientFailure({ error }))
            )
          )
        )
      )
    );

    this.loginClientSuccess$ = createEffect(
      () =>
        this.action$.pipe(
          ofType(AuthActions.loginClientSuccess),
          tap(() => {
            this.router.navigate(['/client-dashboard']);
          })
        ),
      {
        dispatch: false,
      }
    );

    this.logoutCompany$ = createEffect(
      () =>
        this.action$.pipe(
          ofType(AuthActions.logOut),
          tap(() => {
            this.authService.logoutCompany();
          })
        ),
      { dispatch: false }
    );

    this.logoutClient$ = createEffect(
      () =>
        this.action$.pipe(
          ofType(AuthActions.logOutClient),
          tap(() => {
            this.authService.loutClient();
          })
        ),
      { dispatch: false }
    );

    this.loginEmployee$ = createEffect(() =>
      this.action$.pipe(
        ofType(AuthActions.loginEmployee),
        mergeMap(({ email, password }) =>
          this.authService.loginEmployee(email, password).pipe(
            map((res) =>
              AuthActions.loginEmployeeSuccess({
                employee: res,
                token: res.token,
              })
            ),
            catchError((error) =>
              of(AuthActions.loginEmployeeFailure({ error }))
            )
          )
        )
      )
    );

    this.loginEmployeeSuccess$ = createEffect(
      () =>
        this.action$.pipe(
          ofType(AuthActions.loginEmployeeSuccess),
          tap(() => {
            this.router.navigate(['/employee-dashboard']);
          })
        ),
      {
        dispatch: false,
      }
    );
  }
}
