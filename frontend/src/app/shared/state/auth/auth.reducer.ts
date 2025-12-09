import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { User } from '../../models/user.model';
import { Company } from '../../models/company.model';

export interface AuthState {
  company: Company | null;
  token: string | null;
  loading: boolean;
  error: any;
}

export const initialState: AuthState = {
  company: null,
  token: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  //login company
  on(AuthActions.loginCompany, (state) => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginCompanySuccess, (state, { company, token }) => ({
    ...state,
    company,
    token,
    loading: false,
  })),
  on(AuthActions.loginCompanyFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  //logout company
  on(AuthActions.logOutCompany, () => initialState),

  // register  company
  on(AuthActions.registerCompany, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.registerCompanySuccess, (state, {company})=>({...state, company, loading: false})),
  on(AuthActions.registerCompanyFailure,(state, {error})=>({ ...state, error, loading: false})),

    // register  client
  on(AuthActions.registerClient, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.registerClientSuccess, (state, {client})=>({...state, client, loading: false})),
  on(AuthActions.registerClientFailure,(state, {error})=>({ ...state, error, loading: false})),

  //login client
  on(AuthActions.loginClient, (state) => ({ ...state, loading: true, error: null })),
  on(AuthActions.loginClientSuccess, (state, { client, token }) => ({
    ...state,
    client,
    token,
    loading: false,
  })),
  on(AuthActions.loginClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))

);
