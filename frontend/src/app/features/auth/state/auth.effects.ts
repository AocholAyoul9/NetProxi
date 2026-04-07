import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { AuthApiService } from '../services/auth.api.service';
import * as AuthActions from './auth.actions';
import { AuthUser } from '../models/user.model';
import { setToken, setRefreshToken, clearTokens } from '../utils/token-storage';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authApiService = inject(AuthApiService);
  private router = inject(Router);

  // ----------------------
  // LOGIN EFFECT
  // ----------------------
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ email, password, userType }) =>
        this.authApiService.login(email, password, userType).pipe(
          tap((res) => {
            setToken(res.token);
            if (res.refreshToken) setRefreshToken(res.refreshToken);
            localStorage.setItem(userType, JSON.stringify(res));
          }),
          map((res) => {
            const user: AuthUser = {
              id: res.id ?? '',
              name: res.name ?? res.username ?? '',
              email: res.email ?? '',
              role: userType,
            };
            return AuthActions.loginSuccess({ user, accessToken: res.token, userType });
          }),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error?.error?.message ?? error.message ?? 'Login failed',
              })
            )
          )
        )
      )
    )
  );

  // ----------------------
  // LOGIN SUCCESS NAVIGATION
  // ----------------------
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ userType }) => {
          const routeMap: Record<string, string> = {
            client: '/client-dashboard',
            company: '/company-admin-dashboard',
            employee: '/employee-dashboard',
          };
          this.router.navigate([routeMap[userType] ?? '/']);
        })
      ),
    { dispatch: false }
  );

  // ----------------------
  // REGISTER EFFECT
  // ----------------------
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ userData, userType }) =>
        this.authApiService.register(userData, userType).pipe(
          tap((res) => {
            setToken(res.token);
            if (res.refreshToken) setRefreshToken(res.refreshToken);
          }),
          map((res) => AuthActions.registerSuccess({ user: res, userType })),
          catchError((error) =>
            of(
              AuthActions.registerFailure({
                error: error?.error?.message ?? error.message ?? 'Registration failed',
              })
            )
          )
        )
      )
    )
  );


  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ userType }) => {
          const routeMap: Record<string, string> = {
            client: '/client-dashboard',
            company: '/company-admin-dashboard',
            employee: '/employee-dashboard',
          };
          this.router.navigate([routeMap[userType] ?? '/']);
        })
      ),
    { dispatch: false }
  );
  // ----------------------
  // LOGOUT EFFECT
  // ----------------------
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

  // ----------------------
  // REFRESH TOKEN
  // ----------------------
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
            of(
              AuthActions.refreshTokenFailure({
                error: error?.error?.message ?? error.message ?? 'Token refresh failed',
              })
            )
          )
        )
      )
    )
  );

  constructor() {}
}