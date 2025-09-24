import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CompanyState} from "./company.reducer";

export const selectCompanyState = createFeatureSelector<CompanyState>('company');

export const selectCurrentCompany = createSelector(selectCompanyState, state =>state.currentCompany);
export const selectNearbyCompanies = createSelector(selectCompanyState, state => state.nearbyCompanies);
export const selectCompanyLoading = createSelector(selectCompanyState, state => state.loading);
