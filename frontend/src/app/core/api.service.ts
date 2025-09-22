import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../shared/models/company.model';
import { Service } from '../shared/models/service.model';
import { Booking } from '../shared/models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8082/api';

  constructor(private http: HttpClient) { }

  findNearByCompanies(lat: number, lng: number, radiusKm: number): Observable<Company[]>{
    return this.http.get<Company[]>(`${this.baseUrl}/companies/nearby?lat=${lat}}&lng=${lng}&radiusKm=${radiusKm}`);
  }

  getCompanyServices(companyId: string): Observable<Service[]>
  {
    return this.http.get<Service[]>(`${this.baseUrl}/companies/${companyId}/services`)
  }

  createBooking(companyId: string, booking: Booking): Observable<Booking>{
    return this.http.post<Booking>(`${this.baseUrl}/companies/${companyId}bookings`, booking);
  }
}

