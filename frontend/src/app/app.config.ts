import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { CompanyReducer } from './shared/state/company/company.reducer';
import { bookingReducer } from './shared/state/booking/booking.reducer';
import { CompanyEffects } from './shared/state/company/company.effects';
import { BookingEffects } from './shared/state/booking/booking.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideStore({
      company: CompanyReducer,
      booking: bookingReducer,
    }),
    provideEffects([CompanyEffects, BookingEffects]),
  ],
};
