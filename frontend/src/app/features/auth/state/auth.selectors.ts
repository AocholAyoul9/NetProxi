import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

// Auto-generated selectors from createFeature
export const {
  selectAuthState,
  selectUser,
  selectAccessToken,
  selectRefreshToken,
  selectLoading,
  selectError,
  selectUserType,
} = authFeature;

export const selectIsAuthenticated = createSelector(
  selectAccessToken,
  (accessToken) => !!accessToken
);

export const selectUserRoles = createSelector(selectUserType, (userType) =>
  userType ? [userType] : []
);

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
  selectAccessToken,
  (accessToken) => accessToken
);

export const selectAuthLoading = selectLoading;

export const selectAuthError = selectError;
