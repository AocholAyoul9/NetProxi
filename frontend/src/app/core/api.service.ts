import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.model';
import { ServiceModel } from '../shared/models/service.model';
import { Booking } from '../shared/models/booking.model';
import { ClientReservation, NearbyCompany, ClientDashboardStats } from '../shared/models/client.model';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /* private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }*/

  // ------------ Companies--------------
  getNearByCompanies(
    lat: number,
    lng: number,
    radiusKm: number
  ): Observable<Company[]> {
    console.log('API called with:', { lat, lng, radiusKm });
    return this.http.get<Company[]>(`${this.baseUrl}/companies/nearby`, {
      //headers: this.getHeaders(),
      //params: { lat, lng, radiusKm },
      params: {
        lat: lat.toString(),
        lng: lng.toString(),
        radiusKm: radiusKm.toString(),
      },
    });
  }

  /*getNearByCompanies(lat: number, lng: number, radiusKm: number) {
  console.log('API called with:', { lat, lng, radiusKm });
  return this.http.get<Company[]>(`/api/companies/nearby`, {
    params: { lat: lat.toString(), lng: lng.toString(), radiusKm: radiusKm.toString() }
  });
}*/

  getCompanyById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/companies/${id}`, {
      //headers: this.getHeaders(),
    });
  }

  getCompanyAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/companies`, {
      //headers: this.getHeaders(),
    });
  }
  registerCompany(data: Partial<Company>): Observable<Company> {
    return this.http.post<Company>(`${this.baseUrl}/companies`, data, {
      //headers: this.getHeaders(),
    });
  }

  updateCompany(id: string, data: Partial<Company>): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/companies/${id}`, data, {
      //headers: this.getHeaders(),
    });
  }

  //-----------------Services--------------

  getCompanyService(companyId: string): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(
      `${this.baseUrl}/services/company/${companyId}`,
      {
        // headers: this.getHeaders(),
      }
    );
  }

  createCompanyService(service: ServiceModel): Observable<ServiceModel> {
    return this.http.post<ServiceModel>(`${this.baseUrl}/services`, service, {
      // headers: this.getHeaders(),
    });
  }

  updateCompanyService(
    serviceId: string,
    service: ServiceModel
  ): Observable<ServiceModel> {
    return this.http.put<ServiceModel>(
      `${this.baseUrl}/services/${serviceId}`,
      service,
      {
        // headers: this.getHeaders(),
      }
    );
  }

  deleteCompanyService(serviceId: string): Observable<ServiceModel> {
    return this.http.delete<ServiceModel>(
      `${this.baseUrl}/services/delete/${serviceId}`,
      {
        // headers: this.getHeaders(),
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
        // headers: this.getHeaders(),
      }
    );
  }

  getCompanyBookings(companyId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(
      `${this.baseUrl}/companies/${companyId}/bookings`,
      {
        // headers: this.getHeaders(),
      }
    );
  }

  cancelBooking(companyId: string, bookingId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/companies/${companyId}/bookings/${bookingId}`,
      {
        // headers: this.getHeaders(),
      }
    );
  }

  // employess

  getCompanyEmployees(companyId: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/companies/${companyId}/employees`,
      {
        // headers: this.getHeaders(),
      }
    );
  }

  addCompanyEmployee(companyId: string, employeeData: any): Observable<any> {
    {
      return this.http.post<any>(
        `${this.baseUrl}/companies/${companyId}/employees`,
        employeeData,
        {
          // headers: this.getHeaders(),
        }
      );
    }
  }

  deleteCompanyEmployee(
    companyId: string,
    employeeId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/companies/${companyId}/employees/${employeeId}`,
      {
        // headers: this.getHeaders(),
      }
    );
  }

  updateCompanyEmployee(
    companyId: string,
    employeeId: string,
    employeeData: any
  ): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/companies/${companyId}/employees/${employeeId}`,
      employeeData,
      {
        // headers: this.getHeaders(),
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
        //  headers: this.getHeaders(),
      }
    );
  }

  renewSubscription(companyId: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/subscribes/${companyId}`,
      {},
      {
        // headers: this.getHeaders(),
      }
    );
  }

  getCompanySubscription(companyId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/subscribes/${companyId}`, {
      // headers: this.getHeaders(),
    });
  }

    // ---------------- Client Reservations ----------------
  getClientReservations(clientId: string): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.baseUrl}/clients/reservations`, {
      headers: { clientId }, // Or use JWT if available
    });
  }

  // ---------------- Update Reservation Status ----------------
  updateReservationStatus(reservationId: string, status: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/clients/reservations/${reservationId}/status`, { status });
  }

  // ---------------- Add Review ----------------
  addReservationReview(reservationId: string, rating: number, review: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/clients/reservations/${reservationId}/review`, { rating, review });
  }

  // ---------------- Search Companies by Address ----------------
  searchCompanies(query: string): Observable<NearbyCompany[]> {
    return this.http.post<NearbyCompany[]>(`${this.baseUrl}/companies/search`, { address: query });
  }

  // ---------------- Get Dashboard Stats ----------------
  getDashboardStats(): Observable<ClientDashboardStats> {
    return this.http.get<ClientDashboardStats>(`${this.baseUrl}/clients/stats`);
  }

  // ---------------- Update Favorite Company ----------------
  updateFavoriteCompany(companyId: string, isFavorite: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/clients/companies/${companyId}/favorite`, { isFavorite });
  }


}
