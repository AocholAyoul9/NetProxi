import { createAction, props } from '@ngrx/store';
import { Company } from '../../models/company.model';



// 🔹 Load all companies
export const loadAllCompanies = createAction('[Company] Load All Companies');

export const loadAllCompaniesSuccess = createAction(
  '[Company] Load All Companies Success',
  props<{ companies: Company[] }>()
);

export const loadAllCompaniesFailure = createAction(
  '[Company] Load All Companies Failure',
  props<{ error: string }>()
);

// 🔹 Load single company by ID

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
