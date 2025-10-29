import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/auth.service';

import * as AuthActions from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  login$;
  loginSuccess$;
  register$;
  logout$;

  constructor(
    private action$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
    this.login$ = createEffect(() =>
      this.action$.pipe(
        ofType(AuthActions.login),
        mergeMap(({ email, password }) =>
          this.authService.login(email, password).pipe(
            map((res) =>
              AuthActions.loginSuccess({ user: res.user, token: res.token })
            ),
            catchError((error) => of(AuthActions.loginFailure({ error })))
          )
        )
      )
    );
    this.loginSuccess$ = createEffect(
      () =>
        this.action$.pipe(
          ofType(AuthActions.loginSuccess),
          tap(() => {
            this.router.navigate(['/dashboard']);
          })
        ),
      {
        dispatch: false,
      }
    );

    this.register$ = createEffect(() =>
      this.action$.pipe(
        ofType(AuthActions.register),
        mergeMap(({ user }) =>
          this.authService.register(user).pipe(
            map((newUser) => AuthActions.registerSuccess({ user: newUser })),
            catchError((error) => of(AuthActions.registerFailure({ error })))
          )
        )
      )
    );

    this.logout$ = createEffect(
      () =>
        this.action$.pipe(
          ofType(AuthActions.logOut),
          tap(() => {
            this.authService.logout();
          })
        ),
      { dispatch: false }
    );
  }
}
