import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, of, tap } from 'rxjs';

import { AuthApiService } from '../services/auth.api.service';
import * as AuthActions from './auth.actions';
import * as CompanyActions from '../../features/companies/state/company.actions';
import { AuthUser } from '../models/user.model';
import { setToken, setRefreshToken, clearTokens } from '../utils/token-storage';

@Injectable()
export class AuthEffects {
  // New unified login effect
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password, userType }) =>
        this.authApiService.login(email, password, userType).pipe(
          tap((res) => {
            setToken(res.token);
            if (res.refreshToken) setRefreshToken(res.refreshToken);
            // Backward compat: store user-specific data
            if (userType === 'client') {
              localStorage.setItem('client', JSON.stringify(res.client ?? res));
            } else if (userType === 'company') {
              localStorage.setItem('company', JSON.stringify(res.company ?? res));
            } else if (userType === 'employee') {
              localStorage.setItem('employee', JSON.stringify(res.employee ?? res));
              if (res.employee?.id) localStorage.setItem('employeeId', res.employee.id);
            }
          }),
          map((res) => {
            const rawUser = res.client ?? res.company ?? res.employee ?? res;
            const user: AuthUser = {
              id: rawUser.id,
              name: rawUser.name,
              email: rawUser.email ?? '',
              role: userType === 'employee' ? 'employee' : userType,
            };
            return AuthActions.loginSuccess({ user, accessToken: res.token, userType });
          }),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error?.error?.message ?? error.message ?? 'Login failed' }))
          )
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ userType }) => {
          const routeMap: Record<string, string> = {
            client: '/client-dashboard',
            company: '/company-admin',
            employee: '/employee-dashboard',
          };
          this.router.navigate([routeMap[userType] ?? '/']);
        })
      ),
    { dispatch: false }
  );

  // New unified register effect
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ userData, userType }) =>
        this.authApiService.register(userData, userType).pipe(
          map((user) => AuthActions.registerSuccess({ user })),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error?.error?.message ?? error.message ?? 'Registration failed' }))
          )
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          clearTokens();
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      mergeMap(({ token }) =>
        this.authApiService.refreshToken(token).pipe(
          tap((res) => setToken(res.accessToken ?? res.token)),
          map((res) =>
            AuthActions.refreshTokenSuccess({ accessToken: res.accessToken ?? res.token })
          ),
          catchError((error) =>
            of(AuthActions.refreshTokenFailure({ error: error?.error?.message ?? error.message ?? 'Token refresh failed' }))
          )
        )
      )
    )
  );

  // -------------------------------------------------------------------------
  // Backward-compatible legacy effects
  // -------------------------------------------------------------------------

  loginCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginCompany),
      mergeMap(({ email, password }) =>
        this.authApiService.login(email, password, 'company').pipe(
          tap((res) => {
            setToken(res.token);
            localStorage.setItem('company', JSON.stringify(res.company ?? res));
          }),
          map((res) =>
            AuthActions.loginCompanySuccess({ company: res.company ?? res, token: res.token })
          ),
          catchError((error) => of(AuthActions.loginCompanyFailure({ error })))
        )
      )
    )
  );

  loadCompanyDataAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginCompanySuccess),
      mergeMap(({ company }) => [
        CompanyActions.loadCompany({ companyId: company.id }),
        CompanyActions.loadCompanyServices({ companyId: company.id }),
        CompanyActions.loadCompanyBookings({ companyId: company.id }),
        CompanyActions.loadCompanyEmployees({ companyId: company.id }),
      ])
    )
  );

  loginCompanySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginCompanySuccess),
        tap(() => this.router.navigate(['/company-admin']))
      ),
    { dispatch: false }
  );

  registerCompany$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerCompany),
      mergeMap(({ company }) =>
        this.authApiService.register(company, 'company').pipe(
          map((newCompany) => AuthActions.registerCompanySuccess({ company: newCompany })),
          catchError((error) => of(AuthActions.registerCompanyFailure({ error })))
        )
      )
    )
  );

  registerClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerClient),
      mergeMap(({ client }) =>
        this.authApiService.register(client, 'client').pipe(
          map((newClient) => AuthActions.registerClientSuccess({ client: newClient })),
          catchError((error) => of(AuthActions.registerClientFailure({ error })))
        )
      )
    )
  );

  loginClient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginClient),
      mergeMap(({ email, password }) =>
        this.authApiService.login(email, password, 'client').pipe(
          tap((res) => {
            setToken(res.token);
            localStorage.setItem('client', JSON.stringify(res.client ?? res));
          }),
          map((res) =>
            AuthActions.loginClientSuccess({ client: res.client ?? res, token: res.token })
          ),
          catchError((error) => of(AuthActions.loginClientFailure({ error })))
        )
      )
    )
  );

  loginClientSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginClientSuccess),
        tap(() => this.router.navigate(['/client-dashboard']))
      ),
    { dispatch: false }
  );

  logoutCompany$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logOut),
        tap(() => {
          clearTokens();
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  logoutClient$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logOutClient),
        tap(() => {
          clearTokens();
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  loginEmployee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginEmployee),
      mergeMap(({ email, password }) =>
        this.authApiService.login(email, password, 'employee').pipe(
          tap((res) => {
            setToken(res.token);
            localStorage.setItem('employee', JSON.stringify(res.employee ?? res));
            if (res.employee?.id) localStorage.setItem('employeeId', res.employee.id);
          }),
          map((res) =>
            AuthActions.loginEmployeeSuccess({ employee: res.employee ?? res, token: res.token })
          ),
          catchError((error) => of(AuthActions.loginEmployeeFailure({ error })))
        )
      )
    )
  );

  loginEmployeeSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginEmployeeSuccess),
        tap(() => this.router.navigate(['/employee-dashboard']))
      ),
    { dispatch: false }
  );

  logoutEmployee$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logOutEmployee),
        tap(() => {
          clearTokens();
          this.router.navigate(['/']);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private authApiService: AuthApiService,
    private router: Router
  ) {}
}
