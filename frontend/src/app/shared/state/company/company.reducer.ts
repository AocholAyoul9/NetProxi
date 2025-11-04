import { createReducer, on } from '@ngrx/store';
import * as CompanyAction from './company.actions';
import { Company } from '../../models/company.model';

export interface CompanyState {
  companyEmployees: any[];
  companyBookings: any[];
  currentCompany: Company | null;
  nearbyCompanies: Company[];
  allCompanies: Company[];
  companyServices: any[];
  loading: boolean;
  error: any;
}

export const initialState: CompanyState = {
  companyEmployees: [],
  companyBookings: [],
  currentCompany: null,
  companyServices: [],
  nearbyCompanies: [],
  allCompanies: [],
  loading: false,
  error: null,
};

export const companyReducer = createReducer(
  initialState,

  on(CompanyAction.loadCompanyEmployees, (state) => ({
    ...state,
    loading: true,
  })),
  on(CompanyAction.loadCompanyEmployeesSuccess, (state, { employees }) => ({
    ...state,
    companyEmployees: employees,
    loading: false,
  })),
  on(CompanyAction.loadCompanyEmployeesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CompanyAction.loadCompanyBookings, (state) => ({
    ...state,
    loading: true,
  })),
  on(CompanyAction.loadCompanyBookingsSuccess, (state, { bookings }) => ({
    ...state,
    companyBookings: bookings,
    loading: false,
  })),
  on(CompanyAction.loadCompanyBookingsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(CompanyAction.loadCompanyServices, (state) => ({
    ...state,
    loading: true,
  })),
  on(CompanyAction.loadCompanyServicesSuccess, (state, { services }) => ({
    ...state,
    companyServices: services,
    loading: false,
  })),
  on(CompanyAction.loadCompanyServicesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CompanyAction.loadAllCompanies, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CompanyAction.loadAllCompaniesSuccess, (state, { companies }) => ({
    ...state,
    loading: false,
    allCompanies: companies,
  })),
  on(CompanyAction.loadAllCompaniesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(CompanyAction.loadCompany, (state) => ({ ...state, loading: true })),
  on(CompanyAction.loadCompanySuccess, (state, { company }) => ({
    ...state,
    currentCompany: company,
    loading: false,
  })),
  on(CompanyAction.loadCompanyFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CompanyAction.loadNearbyCompanies, (state) => ({
    ...state,
    loading: true,
  })),
  on(CompanyAction.loadNearbyCompaniesSuccess, (state, { companies }) => ({
    ...state,
    nearbyCompanies: companies,
    loading: false,
  })),
  on(CompanyAction.loadNearbyCompaniesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
