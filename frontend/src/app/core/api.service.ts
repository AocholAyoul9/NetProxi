import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Company } from '../shared/models/company.model';
import { ServiceModel } from '../shared/models/service.model';
import { Booking, CreateBookingRequest } from '../shared/models/booking.model';
import { NearbyCompany, ClientProfile } from '../shared/models/client.model';
import { EmployeeProfile, EmployeeTask ,EmployeeSchedule , EmployeeStats, EmployeeNotification} from '../shared/models/employee.model';

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
    booking: CreateBookingRequest
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




  assignBookingToEmployee(
  companyId: string,
  bookingId: string,
  employeeId: string
): Observable<any> {

  return this.http.patch<any>(
    `${this.baseUrl}/companies/${companyId}/bookings/${bookingId}/assign`,
    null,
    {
      params: { employeeId }
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
      headers: { clientId },
    });
  }

// ---------------- Client Profile ----------------
getClientProfile(): Observable<ClientProfile> {
  const clientId = this.authService.getClientId();

  return this.http.get<ClientProfile>(`${this.baseUrl}/clients/profile`, {
    headers: new HttpHeaders({
      clientId: clientId
    })
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


  // ---------------- Update Favorite Company ----------------
  updateFavoriteCompany(companyId: string, isFavorite: boolean): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/clients/companies/${companyId}/favorite`, { isFavorite });
  }

//employee Dashboard
// ------------ Méthodes Employé ---------------

private getEmployeeHeaders(): HttpHeaders {
  const employeeId = localStorage.getItem('employeeId');

  return new HttpHeaders({
    'Content-Type': 'application/json',
    employeeId: employeeId ?? ''
  });
}


  // 1. Get employee profile for dashboard
  getEmployeeProfile(): Observable<EmployeeProfile> {
    return this.http.get<EmployeeProfile>(`${this.baseUrl}/companies/employees/profile`, {
      headers: this.getEmployeeHeaders()
    });
  }

  // 2. Update employee profile
  updateEmployeeProfile(profile: Partial<EmployeeProfile>): Observable<EmployeeProfile> {
    return this.http.patch<EmployeeProfile>(`${this.baseUrl}/companies/employees/profile`, profile, {
      headers: this.getEmployeeHeaders()
    });
  }

  // 3. Get employee tasks (with filtering)
  getEmployeeTasks(
    status?: string,
    date?: string,
    priority?: string
  ): Observable<EmployeeTask[]> {
    let params: any = {};
    if (status) params.status = status;
    if (date) params.date = date;
    if (priority) params.priority = priority;

    return this.http.get<EmployeeTask[]>(`${this.baseUrl}/companies/employees/tasks`, {
      headers: this.getEmployeeHeaders(),
      params
    });
  }

  // 4. Get today's tasks
  getEmployeeTodayTasks(): Observable<EmployeeTask[]> {
    return this.http.get<EmployeeTask[]>(`${this.baseUrl}/companies/employees/tasks/today`, {
      headers: this.getEmployeeHeaders()
    });
  }

  // 5. Get upcoming tasks (next 7 days)
  getEmployeeUpcomingTasks(): Observable<EmployeeTask[]> {
    return this.http.get<EmployeeTask[]>(`${this.baseUrl}/companies/employees/tasks/upcoming`, {
      headers: this.getEmployeeHeaders()
    });
  }

  // 6. Get completed tasks
  getEmployeeCompletedTasks(days: number = 30): Observable<EmployeeTask[]> {
    return this.http.get<EmployeeTask[]>(`${this.baseUrl}/companies/employees/tasks/completed`, {
      headers: this.getEmployeeHeaders(),
      params: { days: days.toString() }
    });
  }

  // 7. Update task status
  updateEmployeeTaskStatus(
    taskId: string,
    status: string,
    data?: { startTime?: string; endTime?: string; notes?: string }
  ): Observable<EmployeeTask> {
    return this.http.patch<EmployeeTask>(
      `${this.baseUrl}/companies/employees/tasks/${taskId}/status`,
      { status, ...data },
      { headers: this.getEmployeeHeaders() }
    );
  }

  // 8. Get task details
  getEmployeeTaskDetails(taskId: string): Observable<EmployeeTask> {
    return this.http.get<EmployeeTask>(`${this.baseUrl}/companies/employees/tasks/${taskId}`, {
      headers: this.getEmployeeHeaders()
    });
  }

  // 9. Get notifications
  getEmployeeNotifications(unreadOnly: boolean = false): Observable<EmployeeNotification[]> {
    return this.http.get<EmployeeNotification[]>(`${this.baseUrl}/companies/employees/notifications`, {
      headers: this.getEmployeeHeaders(),
      params: { unreadOnly: unreadOnly.toString() }
    });
  }

  // 10. Mark notification as read
  markEmployeeNotificationAsRead(notificationId: string): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/companies/employees/notifications/${notificationId}/read`,
      {},
      { headers: this.getEmployeeHeaders() }
    );
  }

  // 11. Mark all notifications as read
  markAllEmployeeNotificationsAsRead(): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/companies/employees/notifications/mark-all-read`,
      {},
      { headers: this.getEmployeeHeaders() }
    );
  }

  // 12. Clear all notifications
  clearAllEmployeeNotifications(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/companies/employees/notifications`, {
      headers: this.getEmployeeHeaders()
    });
  }

  // 13. Get employee statistics
  getEmployeeStats(period: string = 'monthly'): Observable<EmployeeStats> {
    return this.http.get<EmployeeStats>(`${this.baseUrl}/companies/employees/stats`, {
      headers: this.getEmployeeHeaders(),
      params: { period }
    });
  }

  // 14. Get employee schedule
  getEmployeeSchedule(
    startDate?: string,
    endDate?: string
  ): Observable<EmployeeSchedule[]> {
    let params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    return this.http.get<EmployeeSchedule[]>(`${this.baseUrl}/companies/employees/schedule`, {
      headers: this.getEmployeeHeaders(),
      params
    });
  }

  // 15. Update availability status
  updateEmployeeAvailability(isAvailable: boolean): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/companies/employees/availability`,
      { isAvailable },
      { headers: this.getEmployeeHeaders() }
    );
  }


}
