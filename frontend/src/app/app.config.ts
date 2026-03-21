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
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { companyReducer } from './shared/state/company/company.reducer';
import { bookingReducer } from './shared/state/booking/booking.reducer';
import { CompanyEffects } from './shared/state/company/company.effects';
import { BookingEffects } from './shared/state/booking/booking.effects';
import { authReducer } from './auth/store/auth.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { authInterceptor } from './auth/interceptors/auth.interceptor';
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
      company: companyReducer,
      booking: bookingReducer,
      auth: authReducer,
      client: clientReducer,
      employee: employeeReducer
     
    }),
    provideEffects([CompanyEffects, BookingEffects, AuthEffects, ClientEffects , EmployeeEffects]),
  ],
};
