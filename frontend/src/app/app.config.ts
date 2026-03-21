import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { companyFeature } from './features/companies/state/company.reducer';
import { bookingReducer } from './shared/state/booking/booking.reducer';
import { CompanyEffects } from './features/companies/state/company.effects';
import { BookingEffects } from './shared/state/booking/booking.effects';
import { authFeature } from './features/auth/state/auth.reducer';
import { AuthEffects } from './features/auth/state/auth.effects';
import { authInterceptor } from './features/auth/interceptors/auth.interceptor';
import { GoogleMapsModule } from '@angular/google-maps';
import { ClientEffects } from './shared/state/client/client.effects';
import { clientReducer } from './shared/state/client/client.reducer';
import { employeeReducer } from './shared/state/employee/employee.reducer';
import { EmployeeEffects } from './shared/state/employee/employee.effects';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    importProvidersFrom(GoogleMapsModule),

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },

    provideStore({
      booking: bookingReducer,
      client: clientReducer,
      employee: employeeReducer,
    }),
    provideState(companyFeature),
    provideState(authFeature),
    provideEffects([CompanyEffects, BookingEffects, AuthEffects, ClientEffects , EmployeeEffects]),
  ],
};
