import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { Company } from '../../models/company.model';

export interface AuthState {
  company: Company | null;
  client: any | null;
  token: string | null;
  loading: boolean;
  userType: 'company' | 'client' | 'employee' | null;
  error: any;
}

export const initialState: AuthState = {
  company: null,
  client: null,
  token: null,
  loading: false,
  userType: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  //login company
  on(AuthActions.loginCompany, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginCompanySuccess, (state, { company, token }) => ({
    ...state,
    company,
    token,
    userType: 'company' as const,
    loading: false,
  })),
  on(AuthActions.loginCompanyFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  //logout company
  on(AuthActions.logOut, () => initialState),
  on(AuthActions.logOutClient, () => initialState),

  // register  company
  on(AuthActions.registerCompany, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.registerCompanySuccess, (state, { company }) => ({
    ...state,
    company,
    loading: false,
  })),
  on(AuthActions.registerCompanyFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  // register  client
  on(AuthActions.registerClient, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.registerClientSuccess, (state, { client }) => ({
    ...state,
    client,
    loading: false,
  })),
  on(AuthActions.registerClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  //login client
  on(AuthActions.loginClient, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginClientSuccess, (state, { client, token }) => ({
    ...state,
    client,
    token,
    userType: 'client' as const,

    loading: false,
  })),
  on(AuthActions.loginClientFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.loginEmployee, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginEmployeeSuccess, (state, { employee, token }) => ({
    ...state,
    client: employee,
    token,
    userType: 'employee' as const,

    loading: false,
  })),
  on(AuthActions.loginEmployeeFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
);
