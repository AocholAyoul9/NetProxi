import { createAction, props } from '@ngrx/store';
import { Company } from '../../models/company.model';
import { ServiceModel } from '../../models/service.model';



//assign employee to booking
export const assignEmployeeToBooking = createAction(
  '[Company] Assign Employee To Booking',
  props<{ companyId: string; bookingId: string; employeeId: string }>()
);
export const assignEmployeeToBookingSuccess = createAction(
  '[Company] Assign Employee To Booking Success',
  props<{ booking: any }>()
);

export const assignEmployeeToBookingFailure = createAction(
  '[Company] Assign Employee To Booking Failure',
  props<{ error: any }>()
);

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

// addcomanyEmployee
export const addCompanyEmployee = createAction(
  '[Company] Add Company Employee',
  props<{ companyId: string; employeeData: any }>()
);
export const addCompanyEmployeeSuccess = createAction(
  '[Company] Add Company Employee Success',
  props<{ employee: any }>()
);
export const addCompanyEmployeeFailure = createAction(
  '[Company] Add Company Employee Failure',
  props<{ error: any }>()
);

// updataCompanyEmployee
export const updateCompanyEmployee = createAction(
  '[Company] Update Company Employee',
  props<{ companyId: string; employeeId: string;   employeeData: any }>()
);
export const updateCompanyEmployeeSuccess = createAction(
  '[Company] Update Company Employee Success',
  props<{ employee: any }>()
);
export const updateCompanyEmployeeFailure = createAction(
  '[Company] Update Company Employee Failure',
  props<{ error: any }>()
);

// deleteCompanyEmployee
export const deleteCompanyEmployee = createAction(
  '[Company] Delete Company Employee',
  props<{ companyId: string; employeeId: string }>()
);
export const deleteCompanyEmployeeSuccess = createAction(
  '[Company] Delete Company Employee Success',
  props<{companyId: string;  employeeId: string }>()
);
export const deleteCompanyEmployeeFailure = createAction(
  '[Company] Delete Company Employee Failure',
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


//createCompanyServices
export const createCompanyService = createAction(
  '[Company] create Company Services',
  props<{ services: ServiceModel}>()
);

export const createCompanyServiceSuccess = createAction(
  '[Company] create Company Services Success',
  props<{ services: ServiceModel }>()
);

export const createCompanyServiceFailure = createAction(
  '[Company] create Company Services Failure',
  props<{ error: any }>()
);


//delete Company Services
export const deleteCompanyService = createAction(
  '[Company] delete Company Services',
  props<{ serviceId: string}>()
);

export const deleteCompanyServiceSuccess = createAction(
  '[Company] delete Company Services Success',
  props<{ serviceId: string }>()
);

export const deleteCompanyServiceFailure = createAction(
  '[Company] delete Company Services Failure',
  props<{ error: any }>()
);


//update Company Services
export const updateCompanyService = createAction(
  '[Company] update Company Services',
  props<{serviceId: string,  service: ServiceModel}>()
);
export const updateCompanyServiceSuccess = createAction(
  '[Company] update Company Services Success',
  props<{ service: ServiceModel }>()
);
export const updateCompanyServiceFailure = createAction(
  '[Company] update Company Services Failure',
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
  '[Company admin] Load Company',
  props<{ companyId: string }>()
);
export const loadCompanySuccess = createAction(
  '[Company admin] Load Company Success',
  props<{ company: Company }>()
);
export const loadCompanyFailure = createAction(
  '[Company admin ] Load Company Failure',
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
