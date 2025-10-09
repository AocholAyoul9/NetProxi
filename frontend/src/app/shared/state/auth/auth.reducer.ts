import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from '../../models/user.model';

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: any;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  //login
  on(AuthActions.login, (state) => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  //logout

  on(AuthActions.logOut, () => initialState),

  // register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.registerSuccess, (state, {user})=>({...state, user, loading: false})),
  on(AuthActions.registerFailure,(state, {error})=>({ ...state, error, loading: false}))
);
