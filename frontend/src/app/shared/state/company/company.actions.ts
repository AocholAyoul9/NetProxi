import { createAction, props } from '@ngrx/store';
import { Company } from '../../models/company.model';



//getCompanyEmployees
export const loadCompanyEmployees = createAction(
  '[Company] Load Company Employees',
  props<{ companyId: string }>()
);
export const loadCompanyEmployeesSuccess = createAction(
  '[Company] Load Company Employees Success',
  props<{ employees: any[] }>()
);

export const loadCompanyEmployeesFailure = createAction(
  '[Company] Load Company Employees Failure',
  props<{ error: any }>()
);

//getCompanyBookings
export const loadCompanyBookings = createAction(
  '[Company] Load Company Bookings',
  props<{ companyId: string }>()
);

export const loadCompanyBookingsSuccess = createAction(
  '[Company] Load Company Bookings Success',
  props<{ bookings: any[] }>()
);
export const loadCompanyBookingsFailure = createAction(
  '[Company] Load Company Bookings Failure',
  props<{ error: any }>()
);

//getCompanyServices
export const loadCompanyServices = createAction(
  '[Company] Load Company Services',
  props<{ companyId: string }>()
);

export const loadCompanyServicesSuccess = createAction(
  '[Company] Load Company Services Success',
  props<{ services: any[] }>()
);

export const loadCompanyServicesFailure = createAction(
  '[Company] Load Company Services Failure',
  props<{ error: any }>()
);

// Load all companies
export const loadAllCompanies = createAction('[Company] Load All Companies');

export const loadAllCompaniesSuccess = createAction(
  '[Company] Load All Companies Success',
  props<{ companies: Company[] }>()
);

export const loadAllCompaniesFailure = createAction(
  '[Company] Load All Companies Failure',
  props<{ error: string }>()
);

// Load single company by ID
export const loadCompany = createAction(
  '[Company] Load Company',
  props<{ id: string }>()
);
export const loadCompanySuccess = createAction(
  '[Company] Load Company Success',
  props<{ company: Company }>()
);
export const loadCompanyFailure = createAction(
  '[Company] Load Company Failure',
  props<{ error: any }>()
);

// Load nearby companies based on location
export const loadNearbyCompanies = createAction(
  '[Company] Load Nearby Companies',
  props<{ lat: number; lng: number; radiusKm: number }>()
);
export const loadNearbyCompaniesSuccess = createAction(
  '[Company] Load Nearby Companies Success',
  props<{ companies: Company[] }>()
);
export const loadNearbyCompaniesFailure = createAction(
  '[Company] Load Nearby Companies Failure',
  props<{ error: any }>()
);
