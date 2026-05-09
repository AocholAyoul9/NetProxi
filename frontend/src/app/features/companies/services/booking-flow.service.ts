import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { CompaniesApiService } from './companies.api';
import { CreateBookingRequest } from '../../booking/models/booking.model';

export type BookingFlowErrorCode = 'booking_failed' | 'auth_failed';

export class BookingFlowError extends Error {
  constructor(
    message: string,
    public code: BookingFlowErrorCode,
    override cause?: unknown,
  ) {
    super(message);
  }
}

export interface BookingFlowClientInput {
  fullName: string;
  email: string;
  phone: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class BookingFlowService {
  constructor(private api: CompaniesApiService) {}

  /**
   * Mirrors NearbyCompanies booking behavior:
   * - use existing localStorage clientId when present
   * - otherwise register client (TempPass123!), if register fails then try login fallback
   * - persist clientId in localStorage on success
   */
  createBookingWithClient(
    companyId: string,
    booking: Omit<CreateBookingRequest, 'clientId'>,
    client: BookingFlowClientInput,
  ): Observable<void> {
    const existingId = localStorage.getItem('clientId');
    if (existingId) {
      return this.api.CreateBooking(companyId, { ...booking, clientId: existingId }).pipe(
        map(() => void 0),
        catchError((err) =>
          throwError(
            () =>
              new BookingFlowError(
                'Erreur lors de la réservation. Veuillez réessayer.',
                'booking_failed',
                err,
              ),
          ),
        ),
      );
    }

    const tempPassword = 'TempPass123!';

    return this.api
      .registerClient({
        name: client.fullName,
        email: client.email,
        password: tempPassword,
        phone: client.phone,
        address: client.address,
      })
      .pipe(
        switchMap((res) => {
          const id = res?.id as string | undefined;
          if (!id) {
            return throwError(
              () =>
                new BookingFlowError(
                  "Erreur d'authentification. Veuillez réessayer.",
                  'auth_failed',
                  res,
                ),
            );
          }

          localStorage.setItem('clientId', id);
          return this.api.CreateBooking(companyId, { ...booking, clientId: id }).pipe(map(() => void 0));
        }),
        catchError((registerErr) => {
          // NearbyCompanies fallback: try login if register fails
          return this.api.loginClient(client.email, tempPassword).pipe(
            switchMap((loginRes) => {
              const id = loginRes?.id as string | undefined;
              if (!id) {
                return throwError(
                  () =>
                    new BookingFlowError(
                      "Erreur d'authentification. Veuillez réessayer.",
                      'auth_failed',
                      loginRes,
                    ),
                );
              }
              localStorage.setItem('clientId', id);
              return this.api.CreateBooking(companyId, { ...booking, clientId: id }).pipe(map(() => void 0));
            }),
            catchError((loginErr) =>
              throwError(
                () =>
                  new BookingFlowError(
                    "Erreur d'authentification. Veuillez réessayer.",
                    'auth_failed',
                    { registerErr, loginErr },
                  ),
              ),
            ),
          );
        }),
        catchError((err) => {
          if (err instanceof BookingFlowError) return throwError(() => err);
          return throwError(
            () =>
              new BookingFlowError(
                'Erreur lors de la réservation. Veuillez réessayer.',
                'booking_failed',
                err,
              ),
          );
        }),
      );
  }
}

