import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Company } from '../../shared/models/company.model';
import { User as EmployeeResponseDto } from '../../shared/models/user.model';
import { Booking as BookingResponseDto } from '../../shared/models/booking.model';
import { ServiceModel as ServiceResponseDto } from '../../shared/models/service.model';

import * as CompanySelectors from '../../shared/state/company/company.selectors';

@Component({
  selector: 'app-company-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-admin-dashboard.component.html',
  styleUrls: ['./company-admin-dashboard.component.scss']
})
export class CompanyAdminDashboardComponent{

  // Selectors
  company$: Observable<Company | null>;
  services$: Observable<ServiceResponseDto[]>;
  bookings$: Observable<BookingResponseDto[]>;
  employees$: Observable<EmployeeResponseDto[]>;
  loading$: Observable<boolean>;

  activeTab: 'overview' | 'services' | 'bookings' | 'employees' = 'overview';

  constructor(private store: Store) {
    // Select data from store
    this.company$ = this.store.select(CompanySelectors.selectCurrentCompany);
    this.services$ = this.store.select(CompanySelectors.selectCompanyServices);
    this.bookings$ = this.store.select(CompanySelectors.selectCompanyBookings);
    this.employees$ = this.store.select(CompanySelectors.selectCompanyEmployees);
    this.loading$ = this.store.select(CompanySelectors.selectCompanyLoading);
  }

 



  // Change UI tab
  setActiveTab(tab: 'overview' | 'services' | 'bookings' | 'employees'): void {
    this.activeTab = tab;
  }

  // Compute revenue
  getTotalRevenue(bookings: BookingResponseDto[] | null): number {
    if (!bookings) return 0;
    return bookings.reduce((total, booking) => total + (booking.price || 0), 0);
  }

  // Stubs for modals / actions
  openServiceModal(): void {
    console.log('Opening service modal');
  }

  openEmployeeModal(): void {
    console.log('Opening employee modal');
  }

  assignEmployeeToBooking(bookingId: string, employeeId: string): void {
    console.log('Assigning employee:', { bookingId, employeeId });
  }

  updateBookingStatus(bookingId: string, status: string): void {
    console.log('Updating booking status:', { bookingId, status });
  }
}
