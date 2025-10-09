import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.model';
import { ServiceModel } from '../shared/models/service.model';
import { Booking } from '../shared/models/booking.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // ------------ Companies--------------
  getNearByCompanies(
    lat: number,
    lng: number,
    radiusKm: number
  ): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/companies/nearby`, {
      headers: this.getHeaders(),
      params: { lat, lng, radiusKm },
    });
  }

  getCompanyById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/companies/${id}`, {
      headers: this.getHeaders(),
    });
  }

  registerCompany(data: Partial<Company>): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}/companies`, data, {
      headers: this.getHeaders(),
    });
  }

  updateCompany(id: string, data: Partial<Company>): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/companies/${id}`, data, {
      headers: this.getHeaders(),
    });
  }

  //-----------------Services--------------

  getCompanyService(companyId: string): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(
      `${this.baseUrl}/companies/${companyId}/services`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  addCompanyService(
    companyId: string,
    data: Partial<ServiceModel>
  ): Observable<ServiceModel> {
    return this.http.post<ServiceModel>(
      `${this.baseUrl}/companies/${companyId}/services`,
      data,
      {
        headers: this.getHeaders(),
      }
    );
  }

  //-----------------Booking------------------

  CreateBooking(
    companyId: string,
    booking: Partial<Booking>
  ): Observable<Booking> {
    return this.http.post<Booking>(
      `${this.baseUrl}/companies/${companyId}/bookings`,
      booking,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getBookingForCompany(companyId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      `${this.baseUrl}/companies/${companyId}/bookings`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  cancelBooking(companyId: string, bookingId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/companies/${companyId}/bookings/${bookingId}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  //---------------------- subscriptions ---------------------------

  subscripCompany(companyId: string, plan: string): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/subscribes`,
      {
        companyId,
        plan,
      },
      {
        headers: this.getHeaders(),
      }
    );
  }

  renewSubscription(companyId: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/subscribes/${companyId}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  getCompanySubscription(companyId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/subscribes/${companyId}`, {
      headers: this.getHeaders(),
    });
  }
}
