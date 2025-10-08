import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { companyReducer } from './shared/state/company/company.reducer';
import { bookingReducer } from './shared/state/booking/booking.reducer';
import { CompanyEffects } from './shared/state/company/company.effects';
import { BookingEffects } from './shared/state/booking/booking.effects';
import { authReducer } from './shared/state/auth/auth.reducer';
import { AuthEffects } from './shared/state/auth/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    provideHttpClient(),

    provideStore({
      company: companyReducer,
      booking: bookingReducer,
      auth: authReducer
    }),
    provideEffects([CompanyEffects, BookingEffects, AuthEffects]),
  ],
};
