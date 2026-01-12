import { Injectable , inject, PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../shared/models/user.model';
import { Company} from '../shared/models/company.model';
import { Client } from '../shared/models/client.model';

import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8082/api';
  private currentCompanySubject = new BehaviorSubject<Company | null>(this.getUserFromStorage());
  public currentCompany$ = this.currentCompanySubject.asObservable();

  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient, private router: Router) {}

  /** Register a new  company */
  registerCompany(Company: Partial<Company>): Observable<Company> {
    return this.http.post<User>(`${this.baseUrl}/companies/register`, Company);
  }


   /** Register a new client */
  registerClient(Client: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}/clients/register`, Client);
  }

  /*** login Client */

 loginClient(email: string, password: string): Observable<{ token: string; client: Client }> {
  return this.http.post<{ token: string; client: Client }>(
    `${this.baseUrl}/clients/login`,
    { email, password }
  ).pipe(
    tap(res => {
        console.log("DEBUG - loginClient response:", res);

      localStorage.setItem('token', res.token);
      localStorage.setItem('client', JSON.stringify(res));
    })
  );
}

loutClient(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('client');
    this.router.navigate(['/']);
  }

  logOutEmployee(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('employee');
    this.router.navigate(['/']);
  }



  /** Login company with email/password */
  loginCompany(email: string, password: string): Observable<{ token: string; company: Company }> {
    return this.http.post<{ token: string; company: Company }>(`${this.baseUrl}/companies/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('company', JSON.stringify(res.company));
        this.currentCompanySubject.next(res.company);
      })
    );
  }

  /** Logout  company */
  logoutCompany(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('company');
    this.currentCompanySubject.next(null);
    this.router.navigate(['/login']);
  }


  loginEmployee(email: string, password: string): Observable<{ token: string; employee: any }> {
    return this.http.post<{ token: string; employee: any }>(`${this.baseUrl}/companies/employees/login`, { email, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
          localStorage.setItem('employeeId', res.employee.id);
        localStorage.setItem('employee', JSON.stringify(res.employee));
      })
    );
  }

  /** Get JWT token */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /** Get currently logged in  company */
  getCurrentCompany(): Company | null {
    return this.currentCompanySubject.value;
  }

  private getUserFromStorage(): User | null {


    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    }
    return null;
  }

  /** Optional: Add auth header for Http requests */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

// Get currently logged in client ID
getClientId(): string {
  if (!isPlatformBrowser(this.platformId)) return '';

  const client = localStorage.getItem('client');

  console.log("DEBUG - raw client in localStorage =", client);
  if (!client) return '';

  try {
    return JSON.parse(client).id || '';
  } catch {
    return '';
  }
}

getEmployeeId(): string{

  if (!isPlatformBrowser(this.platformId)) return '';

    const employee = localStorage.getItem('employee');

    console.log("DEBUG - raw client in localStorage =", employee);
    if (!employee) return '';

    try {
      return JSON.parse(employee).id || '';
    } catch {
      return '';
    }

    //return localStorage.getItem('employeeId') || '';

  }
}
