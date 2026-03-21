import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { CompaniesApiService } from '../services/companies.api';
import * as CompanyActions from './company.actions';

@Injectable()
export class CompanyEffects {
  loadCompany$;
  loadNearbyCompanies$;
  loadAllCompanies$;
  loadCompanyServices$;
  loadCompanyBookings$;
  loadCompanyEmployees$;
  createCompanyService$;
  deleteCompanyService$;
  updateCompanyService$;
  addCompanyEmployee$;
  updateCompanyEmployee$;
  deleteCompanyEmployee$;

  constructor(private actions$: Actions, private api: CompaniesApiService) {
    this.loadCompanyEmployees$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.loadCompanyEmployees),
        mergeMap(({ companyId }) =>
          this.api.getCompanyEmployees(companyId).pipe(
            map((employees) =>
              CompanyActions.loadCompanyEmployeesSuccess({ employees })
            ),
            catchError((error) =>
              of(CompanyActions.loadCompanyEmployeesFailure({ error }))
            )
          )
        )
      )
    );

    this.loadCompanyBookings$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.loadCompanyBookings),
        mergeMap(({ companyId }) =>
          this.api.getCompanyBookings(companyId).pipe(
            map((bookings) =>
              CompanyActions.loadCompanyBookingsSuccess({ bookings })
            ),
            catchError((error) =>
              of(CompanyActions.loadCompanyBookingsFailure({ error }))
            )
          )
        )
      )
    );

    this.loadCompanyServices$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.loadCompanyServices),
        mergeMap(({ companyId }) =>
          this.api.getCompanyService(companyId).pipe(
            map((services) =>
              CompanyActions.loadCompanyServicesSuccess({ services })
            ),
            catchError((error) =>
              of(CompanyActions.loadCompanyServicesFailure({ error }))
            )
          )
        )
      )
    );

    this.createCompanyService$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.createCompanyService),
        mergeMap(({ services }) =>
          this.api.createCompanyService(services).pipe(
            map((createdService) =>
              CompanyActions.createCompanyServiceSuccess({
                services: createdService,
              })
            ),
            catchError((error) =>
              of(CompanyActions.createCompanyServiceFailure({ error }))
            )
          )
        )
      )
    );

    this.deleteCompanyService$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.deleteCompanyService),
        mergeMap(({ serviceId }) =>
          this.api.deleteCompanyService(serviceId).pipe(
            map(() => CompanyActions.deleteCompanyServiceSuccess({ serviceId })),
            catchError((error) =>
              of(CompanyActions.deleteCompanyServiceFailure({ error }))
            )
          )
        )
      )
    );

    this.updateCompanyService$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.updateCompanyService),
        mergeMap((action) =>
          this.api.updateCompanyService(action.serviceId, action.service).pipe(
            map((updatedService) =>
              CompanyActions.updateCompanyServiceSuccess({
                service: updatedService,
              })
            ),
            catchError((error) =>
              of(CompanyActions.updateCompanyServiceFailure({ error }))
            )
          )
        )
      )
    );

    this.loadCompany$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.loadCompany),
        mergeMap(({ companyId }) =>
          this.api.getCompanyById(companyId).pipe(
            map((company) => CompanyActions.loadCompanySuccess({ company })),
            catchError((error) =>
              of(CompanyActions.loadCompanyFailure({ error }))
            )
          )
        )
      )
    );

    this.loadNearbyCompanies$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.loadNearbyCompanies),
        mergeMap(({ lat, lng, radiusKm }) =>
          this.api.getNearByCompanies(lat, lng, radiusKm).pipe(
            map((companies) => {
              console.log('Nearby companies from API:', companies);
              return CompanyActions.loadNearbyCompaniesSuccess({ companies });
            }),
            catchError((error) =>
              of(CompanyActions.loadNearbyCompaniesFailure({ error }))
            )
          )
        )
      )
    );

    this.loadAllCompanies$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.loadAllCompanies),
        mergeMap(() =>
          this.api.getCompanyAllCompanies().pipe(
            map((companies) =>
              CompanyActions.loadAllCompaniesSuccess({ companies })
            ),
            catchError((error) =>
              of(
                CompanyActions.loadAllCompaniesFailure({ error: error.message })
              )
            )
          )
        )
      )
    );

    this.addCompanyEmployee$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.addCompanyEmployee),
        mergeMap(({ companyId, employeeData }) =>
          this.api.addCompanyEmployee(companyId, employeeData).pipe(
            map((newEmployee) =>
              CompanyActions.addCompanyEmployeeSuccess({
                employee: newEmployee,
              })
            ),
            catchError((error) =>
              of(CompanyActions.addCompanyEmployeeFailure({ error }))
            )
          )
        )
      )
    );

    this.updateCompanyEmployee$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.updateCompanyEmployee),
        mergeMap(({ companyId, employeeId, employeeData }) =>
          this.api
            .updateCompanyEmployee(companyId, employeeId, employeeData)
            .pipe(
              map((updatedEmployee) =>
                CompanyActions.updateCompanyEmployeeSuccess({
                  employee: updatedEmployee,
                })
              ),
              catchError((error) =>
                of(CompanyActions.updateCompanyEmployeeFailure({ error }))
              )
            )
        )
      )
    );

    this.deleteCompanyEmployee$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CompanyActions.deleteCompanyEmployee),
        mergeMap(({ companyId, employeeId }) =>
          this.api.deleteCompanyEmployee(companyId, employeeId).pipe(
            map(() =>
              CompanyActions.deleteCompanyEmployeeSuccess({
                companyId,
                employeeId,
              })
            ),
            catchError((error) =>
              of(CompanyActions.deleteCompanyEmployeeFailure({ error }))
            )
          )
        )
      )
    );
  }
}
