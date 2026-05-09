import { mergeApplicationConfig, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { appConfig } from './app.config';

const browserConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(GoogleMapsModule),
  ]
};

export const config = mergeApplicationConfig(appConfig, browserConfig);
