import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(selectAuthState, (state) => state.user);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => !!state.accessToken
);

export const selectUserRoles = createSelector(selectAuthState, (state) =>
  state.userType ? [state.userType] : []
);

export const selectLoading = createSelector(selectAuthState, (state) => state.loading);

export const selectError = createSelector(selectAuthState, (state) => state.error);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state) => state.accessToken
);

export const selectUserType = createSelector(selectAuthState, (state) => state.userType);

// ---------------------------------------------------------------------------
// Backward-compatible selectors used by existing components
// ---------------------------------------------------------------------------

export const selectIsCompanyLoggedIn = createSelector(
  selectAuthState,
  (state) => state.userType === 'company' && !!state.accessToken
);

export const selectIsClientLoggedIn = createSelector(
  selectAuthState,
  (state) => state.userType === 'client' && !!state.accessToken
);

export const selectCurrentCompany = createSelector(selectAuthState, (state) =>
  state.userType === 'company' ? state.user : null
);

export const selectClient = createSelector(selectAuthState, (state) =>
  state.userType === 'client' ? state.user : null
);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state) => state.accessToken
);

export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);
