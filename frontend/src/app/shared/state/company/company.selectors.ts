import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CompanyState } from './company.reducer';

interface Company {
  active: boolean;
  activePlan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE' | null;
}

export const selectCompanyState =
  createFeatureSelector<CompanyState>('company');

export interface CompanyStats {
  totalCompanies: number;
  activeCompanies: number;
  totalRevenue: number;
}

export const selectAllCompanies = createSelector(
  selectCompanyState,
  (state) => state.allCompanies
);

export const selectCompanyStats = createSelector(
  selectAllCompanies,
  (companies) => {
    const totalCompanies = companies.length;

    const activeCompanies = companies.filter(c => c.active).length;

    const PLAN_PRICES: Record<NonNullable<Company['activePlan']>, number> = {
      FREE: 0,
      BASIC: 49.99,
      PREMIUM: 99.9,
      ENTERPRISE: 249.99,
    };

   const totalRevenue = companies.reduce((sum, c) => {
  if (c.active && c.activePlan !== null) {
    const plan = c.activePlan as NonNullable<Company['activePlan']>;
    return sum + PLAN_PRICES[plan];
  }
  return sum;
}, 0);


    return {
      totalCompanies,
      activeCompanies,
      totalRevenue,
    } as CompanyStats;
  }
);

export const selectCurrentCompany = createSelector(
  selectCompanyState,
  (state) => state.currentCompany
);
export const selectNearbyCompanies = createSelector(
  selectCompanyState,
  (state) => state.nearbyCompanies
);
export const selectCompanyLoading = createSelector(
  selectCompanyState,
  (state) => state.loading
);
export const selectCompanyError = createSelector(
  selectCompanyState,
  (state) => state.error
);

export const selectCompanyServices = createSelector(
  selectCompanyState,
  (state) => state.companyServices
);
export const selectCompanyBookings = createSelector(
  selectCompanyState,
  (state) => state.companyBookings
);

export const selectCompanyEmployees = createSelector(
  selectCompanyState,
  (state) => state.companyEmployees
);
