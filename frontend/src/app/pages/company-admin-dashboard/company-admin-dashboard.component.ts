/*// company-admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { User as EmployeeResponseDto } from '../../shared/models/user.model';
import { Booking as BookingResponseDto } from '../../shared/models/booking.model';

import { ServiceModel as ServiceResponseDto } from '../../shared/models/service.model';

import { Company } from '../../shared/models/company.model';
import * as CompanyActions from '../../shared/state/company/company.actions';
import * as CompanySelectors from '../../shared/state/company/company.selectors';

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
    //this.store.dispatch(CompanyActions.loadCompanyDashboard());
  }

  setActiveTab(tab: 'overview' | 'services' | 'bookings' | 'employees'): void {
    this.activeTab = tab;
  }

  createService(serviceData: any): void {
    //this.store.dispatch(CompanyActions.createService({ serviceData }));
  }

  assignEmployeeToBooking(bookingId: string, employeeId: string): void {
    //this.store.dispatch(CompanyActions.assignEmployeeToBooking({ bookingId, employeeId }));
  }

  updateBookingStatus(bookingId: string, status: string): void {
    this.store.dispatch(CompanyActions.updateBookingStatus({ bookingId, status }));
  }

  openServiceModal(serviceId?: string): void {
  }

  openEmployeeModal(employeeId?: string): void {}
}*/


// company-admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Company } from '../../shared/models/company.model';


import { User as EmployeeResponseDto } from '../../shared/models/user.model';
import { Booking as BookingResponseDto } from '../../shared/models/booking.model';

import { ServiceModel as ServiceResponseDto } from '../../shared/models/service.model';
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

  constructor() {
    // Mock data to avoid errors
    this.company$ = of(this.createMockCompany());
    this.services$ = of(this.createMockServices());
    this.bookings$ = of(this.createMockBookings());
    this.employees$ = of(this.createMockEmployees());
    this.loading$ = of(false);
  }

  ngOnInit(): void {
    // No API calls needed for mock data
  }

  setActiveTab(tab: 'overview' | 'services' | 'bookings' | 'employees'): void {
    this.activeTab = tab;
  }

  createService(serviceData: any): void {
    console.log('Creating service:', serviceData);
    // Mock implementation
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

  private createMockServices(): ServiceResponseDto[] {
    return [
      {
        id: '1',
        name: 'Nettoyage Résidentiel',
        description: 'Nettoyage complet de votre maison ou appartement',
        basePrice: 80,
        durationInMinutes: 120,
        companyId: '1',
        companyName: 'CleanPro Services',
        active: true
      },
      {
        id: '2',
        name: 'Nettoyage de Bureau',
        description: 'Nettoyage professionnel pour espaces de travail',
        basePrice: 150,
        durationInMinutes: 180,
        companyId: '1',
        companyName: 'CleanPro Services',
        active: true
      },
      {
        id: '3',
        name: 'Nettoyage après Déménagement',
        description: 'Nettoyage en profondeur après un déménagement',
        basePrice: 200,
        durationInMinutes: 240,
        companyId: '1',
        companyName: 'CleanPro Services',
        active: true
      }
    ];
  }

  private createMockBookings(): BookingResponseDto[] {
    return [
      {
        id: '1',
        clientId: '101',
        clientName: 'Marie Dubois',
        serviceId: '1',
        serviceName: 'Nettoyage Résidentiel',
        companyId: '1',
        companyName: 'CleanPro Services',
        startTime: new Date('2024-01-15T10:00:00'),
        endTime: new Date('2024-01-15T12:00:00'),
        address: '45 Avenue des Champs, Paris',
        price: 80,
        status: 'CONFIRMED',
        assignedEmployeeId: '201',
        assignedEmployeeName: 'Jean Martin'
      },
      {
        id: '2',
        clientId: '102',
        clientName: 'Pierre Lambert',
        serviceId: '2',
        serviceName: 'Nettoyage de Bureau',
        companyId: '1',
        companyName: 'CleanPro Services',
        startTime: new Date('2024-01-16T14:00:00'),
        endTime: new Date('2024-01-16T17:00:00'),
        address: '12 Rue de Commerce, Paris',
        price: 150,
        status: 'PENDING',
        assignedEmployeeId: '235',
        assignedEmployeeName: 'Thomas Bernard'
      },
      {
        id: '3',
        clientId: '103',
        clientName: 'Sophie Moreau',
        serviceId: '3',
        serviceName: 'Nettoyage après Déménagement',
        companyId: '1',
        companyName: 'CleanPro Services',
        startTime: new Date('2024-01-17T09:00:00'),
        endTime: new Date('2024-01-17T13:00:00'),
        address: '78 Boulevard Saint-Germain, Paris',
        price: 200,
        status: 'COMPLETED',
        assignedEmployeeId: '202',
        assignedEmployeeName: 'Lucie Petit'
      }
    ];
  }

  private createMockEmployees(): EmployeeResponseDto[] {
    return [
      {
        id: '201',
        name: 'Jean Martin',
        email: 'jean.martin@cleanpro.com',
        phone: '+33 6 12 34 56 78',
        address: 'Paris, France',
        active: true
      },
      {
        id: '202',
        name: 'Lucie Petit',
        email: 'lucie.petit@cleanpro.com',
        phone: '+33 6 23 45 67 89',
        address: 'Paris, France',
        active: true
      },
      {
        id: '203',
        name: 'Thomas Bernard',
        email: 'thomas.bernard@cleanpro.com',
        phone: '+33 6 34 56 78 90',
        address: 'Paris, France',
        active: true
      }
    ];
  }

  // Modal methods (stubs)
  openServiceModal(): void {
    console.log('Opening service modal');
  }

  openEmployeeModal(): void {
    console.log('Opening employee modal');
  }
}