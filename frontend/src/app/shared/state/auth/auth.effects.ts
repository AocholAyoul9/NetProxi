import {Injectable } from '@angular/core';
import {Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from "../../../core/auth.service";

import * as AuthActions from  './auth.actions';
import {catchError, map, mergeMap, of, tap} from 'rxjs';
import {Router} from '@angular/router';
import { error } from 'node:console';

@Injectable()
export class AuthEffects {
    constructor(
        private action$: Actions,
        private authService: AuthService,
        private router: Router 
    ){}


    login$ = createEffect(()=>
    this.action$.pipe(
        ofType(AuthActions.login),
        mergeMap(({email, password})=>
        this.authService.login(email, password).pipe(
            map(res => AuthActions.loginSuccess({user: res.user, token: res.token })),
            catchError(error => of(AuthActions.loginFailure({error})))
        ))
    ))

    loginSuccess$ = createEffect(
        ()=> this.action$.pipe(
            ofType(
                AuthActions.loginSuccess
            ),
            tap(()=>{
                this.router.navigate(['/dashboard']);
            })
        ),
        {
            dispatch: false
        }
    );

    register$ = createEffect(() =>
    this.action$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ user }) =>
        this.authService.register(user).pipe(
          map(newUser => AuthActions.registerSuccess({ user: newUser })),
          catchError(error => of(AuthActions.registerFailure({ error })))
        )
      )
    )
  );

  logout$ = createEffect(
    ()=>this.action$.pipe(
        ofType(AuthActions.logOut),
        tap(()=>{
            this.authService.logout();
        })
    ),
    {dispatch: false}
  );
}
