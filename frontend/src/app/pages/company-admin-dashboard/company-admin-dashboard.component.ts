// company-admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Company } from '../../shared/models/company.model';
import * as CompanySelectors from '../../shared/state/company/company.selectors';
import * as CompanyActions from '../../shared/state/company/company.actions';


import { User as EmployeeResponseDto } from '../../shared/models/user.model';
import { Booking as BookingResponseDto } from '../../shared/models/booking.model';

import { ServiceModel as ServiceResponseDto } from '../../shared/models/service.model';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-company-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-admin-dashboard.component.html',
  styleUrls: ['./company-admin-dashboard.component.scss']
})
export class CompanyAdminDashboardComponent implements OnInit {
  company$: Observable<Company | null>;
  services$: Observable<ServiceResponseDto[]>;
  bookings$: Observable<BookingResponseDto[]>;
  employees$: Observable<EmployeeResponseDto[]>;
  loading$: Observable<boolean>;

  activeTab: 'overview' | 'services' | 'bookings' | 'employees' = 'overview';

  constructor(private store: Store) {

    this.company$ = this.store.select(CompanySelectors.selectCurrentCompany);
    this.services$ =  this.store.select(CompanySelectors.selectCompanyServices);
    this.bookings$ = this.store.select(CompanySelectors.selectCompanyBookings);
    this.employees$ = this.store.select(CompanySelectors.selectCompanyEmployees);
    this.loading$ = this.store.select(CompanySelectors.selectCompanyLoading);
  }

  ngOnInit(): void {
    // No API calls needed for mock data
  }

  setActiveTab(tab: 'overview' | 'services' | 'bookings' | 'employees'): void {
    this.activeTab = tab;
  }

  createService(serviceData: any): void {
   //this.store.dispatch(CompanyActions.createService({ serviceData }));
  }

  assignEmployeeToBooking(bookingId: string, employeeId: string): void {
    console.log('Assigning employee:', { bookingId, employeeId });
    // Mock implementation
  }

  updateBookingStatus(bookingId: string, status: string): void {
    console.log('Updating booking status:', { bookingId, status });
    // Mock implementation
  }

  getTotalRevenue(bookings: BookingResponseDto[] | null): number {
    if (!bookings) return 0;
    return bookings.reduce((total, booking) => total + (booking.price || 0), 0);
  }

  // Mock data creation methods
  private createMockCompany(): Company {
    return {
      id: '1',
      name: 'CleanPro Services',
      email: 'contact@cleanpro.com',
      phone: '+33 1 23 45 67 89',
      address: '123 Rue de Paris, 75001 Paris',
      active: true,
      activePlan: 'PREMIUM',
      logoUrl: '',
      website: 'https://cleanpro.com',
      description: 'Service de nettoyage professionnel',
      rating: 4.5,
      reviewsCount: 127,
      services: []
    };
  }

  

  // Modal methods (stubs)
  openServiceModal(): void {
    console.log('Opening service modal');
  }

  openEmployeeModal(): void {
    console.log('Opening employee modal');
  }
}