import { createFeature, createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { AuthUser } from '../models/user.model';

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  userType: 'client' | 'company' | 'employee' | null;
}

const initialAuthState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  userType: null,
};

export const authFeature = createFeature({
  name: 'auth' as const,
  reducer: createReducer(
    initialAuthState,

    // New unified login actions
    on(AuthActions.login, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.loginSuccess, (state, { user, accessToken, userType }) => ({
      ...state,
      user,
      accessToken,
      userType,
      loading: false,
      error: null,
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),

    // Register
    on(AuthActions.register, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.registerSuccess, (state) => ({
      ...state,
      loading: false,
      error: null,
    })),
    on(AuthActions.registerFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),

    // Logout
    on(AuthActions.logout, () => initialAuthState),

    // Refresh Token
    on(AuthActions.refreshToken, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.refreshTokenSuccess, (state, { accessToken }) => ({
      ...state,
      accessToken,
      loading: false,
      error: null,
    })),
    on(AuthActions.refreshTokenFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),

    // Load Current User
    on(AuthActions.loadCurrentUser, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.loadCurrentUserSuccess, (state, { user }) => ({
      ...state,
      user,
      loading: false,
      error: null,
    })),
    on(AuthActions.loadCurrentUserFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    })),

    // -------------------------------------------------------------------------
    // Backward-compatible legacy action handlers
    // -------------------------------------------------------------------------
    on(AuthActions.loginCompany, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.loginCompanySuccess, (state, { company, token }) => ({
      ...state,
      user: { id: company.id, name: company.name, email: company.email ?? '', role: 'company' as const },
      accessToken: token,
      userType: 'company' as const,
      loading: false,
      error: null,
    })),
    on(AuthActions.loginCompanyFailure, (state, { error }) => ({
      ...state,
      error: String(error),
      loading: false,
    })),
    on(AuthActions.logOut, () => initialAuthState),

    on(AuthActions.registerCompany, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.registerCompanySuccess, (state) => ({
      ...state,
      loading: false,
      error: null,
    })),
    on(AuthActions.registerCompanyFailure, (state, { error }) => ({
      ...state,
      error: String(error),
      loading: false,
    })),

    on(AuthActions.registerClient, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.registerClientSuccess, (state) => ({
      ...state,
      loading: false,
      error: null,
    })),
    on(AuthActions.registerClientFailure, (state, { error }) => ({
      ...state,
      error: String(error),
      loading: false,
    })),

    on(AuthActions.loginClient, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.loginClientSuccess, (state, { client, token }) => ({
      ...state,
      user: { id: client.id ?? client.client?.id, name: client.name ?? client.client?.name, email: client.email ?? client.client?.email ?? '', role: 'client' as const },
      accessToken: token,
      userType: 'client' as const,
      loading: false,
      error: null,
    })),
    on(AuthActions.loginClientFailure, (state, { error }) => ({
      ...state,
      error: String(error),
      loading: false,
    })),
    on(AuthActions.logOutClient, () => initialAuthState),

    on(AuthActions.loginEmployee, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.loginEmployeeSuccess, (state, { employee, token }) => ({
      ...state,
      user: { id: employee.id, name: employee.name, email: employee.email ?? '', role: 'employee' as const },
      accessToken: token,
      userType: 'employee' as const,
      loading: false,
      error: null,
    })),
    on(AuthActions.loginEmployeeFailure, (state, { error }) => ({
      ...state,
      error: String(error),
      loading: false,
    })),
    on(AuthActions.logOutEmployee, () => initialAuthState),
  ),
});

export const authReducer = authFeature.reducer;
export { initialAuthState };
