import {Injectable } from '@angular/core';
import {Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from "../../../core/auth.service";

import * as AuthActions from  './auth.actions';
import {catchError, map, mergeMap, of, tap} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()
export class AuthEffects {
    constructor(
        private action$: Actions,
        private authService: AuthService,
        private router: Router 
    ){}


    login$ = createEffect(()=>
    this.actions$.pipe(
        ofType(AuthActions.login),
        mergeMap(({email, password})=>
        this.authService.login(email, password).pipe(
            map(res => AuthActions.loginSuccess({user: res.user, token: res.token }))
        ))
    ))
}
