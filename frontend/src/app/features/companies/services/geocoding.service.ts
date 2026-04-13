import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api';

  geocodeAddress(address: string): Observable<{ lat: number; lng: number } | null> {
    return this.http.post<{ lat: number; lng: number; displayName?: string }>(
      `${this.baseUrl}/companies/geocode`,
      { address }
    ).pipe(
      map(response => {
        if (response && response.lat && response.lng) {
          return { lat: response.lat, lng: response.lng };
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }
}