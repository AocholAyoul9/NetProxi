import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentCompany = createSelector(
    selectAuthState,
    state => state.company
);

export const selectAuthToken = createSelector(
    selectAuthState,
    state => state.token
);

export const selectAuthLoading = createSelector(
    selectAuthState,
    state => state.loading
);

export const selectIsCompanyLoggedIn = createSelector(
  selectAuthState,
  (auth) => auth.userType === 'company' && !!auth.company
);

export const selectIsClientLoggedIn = createSelector(
  selectAuthState,
  auth => auth.userType === 'client' && !!auth.client
);

export const selectClient = createSelector(
  selectAuthState,
  auth => auth.client
);

export const selectAuthError = createSelector(
    selectAuthState,
    state => state.error
);