import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(
    email: string,
    password: string,
    userType: 'client' | 'company' | 'employee'
  ): Observable<any> {
    const endpointMap: Record<string, string> = {
      client: '/auth/clients/login',
      company: '/auth/companies/login',
      employee: '/auth/companies/employees/login',
    };
    return this.http.post(`${this.baseUrl}${endpointMap[userType]}`, { email, password });
  }

  register(userData: any, userType: 'client' | 'company'): Observable<any> {
    const endpointMap: Record<string, string> = {
      client: '/auth/clients/register',
      company: '/auth/companies/register',
    };
    return this.http.post(`${this.baseUrl}${endpointMap[userType]}`, userData);
  }

  refreshToken(token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/refresh`, { token });
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/me`);
  }
}
