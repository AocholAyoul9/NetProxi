import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

// Auto-generated feature selectors
export const {
  selectAuthState,
  selectUser,
  selectAccessToken,
  selectRefreshToken,
  selectLoading,
  selectError,
  selectUserType,
} = authFeature;

// ---------------------------
// Unified selectors
// ---------------------------

// Is the user authenticated
export const selectIsAuthenticated = createSelector(
  selectAccessToken,
  (accessToken) => !!accessToken
);

// Current logged-in user (any type)
export const selectCurrentUser = selectUser;

// Current user type ('client' | 'company' | 'employee' | null)
export const selectCurrentUserType = selectUserType;

// Current access token
export const selectAuthToken = selectAccessToken;

// Current refresh token
export const selectAuthRefreshToken = selectRefreshToken;

// Loading and error state
export const selectAuthLoading = selectLoading;
export const selectAuthError = selectError;

// User roles array (for RBAC)
export const selectUserRoles = createSelector(
  selectUserType,
  (userType) => (userType ? [userType] : [])
);