import { createSelector } from '@ngrx/store';
import { companyFeature } from './company.reducer';

interface CompanyPlan {
  active: boolean;
  activePlan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE' | null;
}

export interface CompanyStats {
  totalCompanies: number;
  activeCompanies: number;
  totalRevenue: number;
}

// Auto-generated selectors from createFeature
export const {
  selectCompanyState,
  selectAllCompanies,
  selectCurrentCompany,
  selectNearbyCompanies,
  selectCompanyEmployees,
  selectCompanyBookings,
  selectCompanyServices,
  selectLoading,
  selectError,
} = companyFeature;

// Backward-compatible aliases
export const selectCompanyLoading = selectLoading;
export const selectCompanyError = selectError;

// Computed selector: derive stats from all companies
export const selectCompanyStats = createSelector(
  selectAllCompanies,
  (companies) => {
    const totalCompanies = companies.length;

    const activeCompanies = companies.filter(c => c.active).length;

    const PLAN_PRICES: Record<NonNullable<CompanyPlan['activePlan']>, number> = {
      FREE: 0,
      BASIC: 49.99,
      PREMIUM: 99.9,
      ENTERPRISE: 249.99,
    };

    const totalRevenue = companies.reduce((sum, c) => {
      if (c.active && c.activePlan !== null) {
        const plan = c.activePlan as NonNullable<CompanyPlan['activePlan']>;
        return sum + PLAN_PRICES[plan];
      }
      return sum;
    }, 0);

    return { totalCompanies, activeCompanies, totalRevenue } as CompanyStats;
  }
);
