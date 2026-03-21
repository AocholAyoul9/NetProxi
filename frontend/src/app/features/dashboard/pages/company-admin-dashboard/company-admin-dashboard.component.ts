import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';

import { Company } from '../../../companies/models/company.model';
import {
  ServiceModel,
  ServiceModel as ServiceResponseDto,
  ServiceUpdateModel,
} from '../../../../shared/models/service.model';
import {
  Employee,
  EmployeeCreateModel,
  EmployeeUpdateModel,
} from '../../../../shared/models/employee.model';

import * as CompanySelectors from '../../../companies/state/company.selectors';
import * as CompanyActions from '../../../companies/state/company.actions';
import { FormsModule } from '@angular/forms';
import { Booking } from '../../../booking/models/booking.model';

type TabType = 'overview' | 'services' | 'bookings' | 'employees';

interface DashboardTab {
  id: TabType;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-company-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './company-admin-dashboard.component.html',
  styleUrls: ['./company-admin-dashboard.component.scss'],
})
export class CompanyAdminDashboardComponent {
  // Selectors
  company$: Observable<Company | null>;
  services$: Observable<ServiceResponseDto[]>;
  bookings$: Observable<Booking[]>;
  employees$: Observable<Employee[]>;
  loading$: Observable<boolean>;

  activeTab: TabType = 'overview';
  companyId: string = '';

  // Tab configuration
  tabs: DashboardTab[] = [
    { id: 'overview', label: "Vue d'ensemble", icon: 'fas fa-chart-pie' },
    { id: 'services', label: 'Services', icon: 'fas fa-concierge-bell' },
    { id: 'bookings', label: 'Réservations', icon: 'fas fa-calendar-check' },
    { id: 'employees', label: 'Employés', icon: 'fas fa-users' },
  ];

  // Recent bookings for overview tab
  recentBookings$: Observable<Booking[]>;

  // Service modals
  newService: ServiceModel = {
    id: '',
    name: '',
    description: '',
    basePrice: 0,
    durationInMinutes: 0,
    companyId: '',
  };

  editingService: ServiceModel | null = null;
  isServiceModalOpen = false;
  isEditServiceModalOpen = false;

  // Employee modals
  newEmployee: EmployeeCreateModel = {
    name: '',
    email: '',
    password:'',
    phone: '',
    address: '',
    companyId: '',
    role: 'cleaner',
  };

  editingEmployee: Employee | null = null;
  isEmployeeModalOpen = false;
  isEditEmployeeModalOpen = false;

  // Available roles for employees
  employeeRoles = [
    { value: 'cleaner', label: 'Agent de Nettoyage' },
    { value: 'supervisor', label: 'Superviseur' },
    { value: 'manager', label: 'Manager' },
    { value: 'admin', label: 'Administrateur' },
  ];

  constructor(private store: Store) {
    // Select data from store
    this.company$ = this.store.select(CompanySelectors.selectCurrentCompany);
    this.services$ = this.store.select(CompanySelectors.selectCompanyServices);
    this.bookings$ = this.store.select(CompanySelectors.selectCompanyBookings);
    this.employees$ = this.store.select(
      CompanySelectors.selectCompanyEmployees
    );
    this.loading$ = this.store.select(CompanySelectors.selectCompanyLoading);

    // Get company ID
    this.company$.subscribe((company) => {
      if (company) {
        this.companyId = company.id;
      }
    });

    // Setup recent bookings (first 5)
    this.recentBookings$ = this.bookings$.pipe(
      map((bookings) => bookings?.slice(0, 5) || [])
    );
  }

  // Change UI tab
  setActiveTab(tab: TabType): void {
    this.activeTab = tab;
  }

  // Compute revenue
  getTotalRevenue(bookings: Booking[] | null): number {
    if (!bookings) return 0;
    return bookings.reduce((total, booking) => total + (booking.price || 0), 0);
  }

  // Service Creation Methods
  openServiceModal(): void {
    this.newService = {
      id: '',
      name: '',
      description: '',
      basePrice: 0,
      durationInMinutes: 0,
      companyId: this.companyId,
    };
    this.isServiceModalOpen = true;
  }

  closeServiceModal(): void {
    this.isServiceModalOpen = false;
  }

  createService(): void {
    this.store.dispatch(
      CompanyActions.createCompanyService({ services: this.newService })
    );
    this.closeServiceModal();
  }

  // Service Update Methods
  openEditServiceModal(service: ServiceModel): void {
    this.editingService = { ...service };
    this.isEditServiceModalOpen = true;
  }

  closeEditServiceModal(): void {
    this.isEditServiceModalOpen = false;
    this.editingService = null;
  }

  updateService(): void {
    if (this.editingService && this.editingService.id) {
      const updateData: ServiceUpdateModel = {
        id: this.editingService.id,
        name: this.editingService.name,
        description: this.editingService.description,
        basePrice: this.editingService.basePrice,
        durationInMinutes: this.editingService.durationInMinutes,
        companyId: this.companyId
      };

      // Dispatch action to update service
      this.store.dispatch(CompanyActions.updateCompanyService({ 
        serviceId: this.editingService.id, 
        service: updateData 
      }));
    this.closeEditServiceModal();
  }}

  // Service Deletion Method
  deleteService(serviceId: string): void {
    this.store.dispatch(CompanyActions.deleteCompanyService({ serviceId }));
  }

  // Employee Creation Methods
  openEmployeeModal(): void {
    this.newEmployee = {
      name: '',
      email: '',
      password:'',
      phone: '',
      address: '',
      companyId: this.companyId,
      role: 'cleaner',
    };
    this.isEmployeeModalOpen = true;
  }

  closeEmployeeModal(): void {
    this.isEmployeeModalOpen = false;
  }

  createEmployee(): void {
    if (
      this.newEmployee.name &&
      this.newEmployee.email &&
      this.newEmployee.phone
    ) {
      // Dispatch action to create employee
      this.store.dispatch(
        CompanyActions.addCompanyEmployee({
          companyId: this.companyId,
          employeeData: this.newEmployee,
        })
      );
      this.closeEmployeeModal();
    }
  }

  // Employee Update Methods
  openEditEmployeeModal(employee: Employee): void {
    this.editingEmployee = { ...employee };
    this.isEditEmployeeModalOpen = true;
  }

  closeEditEmployeeModal(): void {
    this.isEditEmployeeModalOpen = false;
    this.editingEmployee = null;
  }

  updateEmployee(): void {
    if (this.editingEmployee && this.editingEmployee.id) {
      const updateData: EmployeeUpdateModel = {
        id: this.editingEmployee.id,
        name: this.editingEmployee.name,
        email: this.editingEmployee.email,
        phone: this.editingEmployee.phone,
        address: this.editingEmployee.address,
        role: this.editingEmployee.role,
      };

      // Dispatch action to update employee
      this.store.dispatch(
        CompanyActions.updateCompanyEmployee({
          companyId: this.companyId,
          employeeId: this.editingEmployee.id,
          employeeData: updateData,
        })
      );
      this.closeEditEmployeeModal();
    }
  }

  // Employee Deletion Method
  deleteEmployee(employeeId: string): void {
      this.store.dispatch(
        CompanyActions.deleteCompanyEmployee({
          companyId: this.companyId,
          employeeId,
        })
      );
  }

  // Get role label for display
  getRoleLabel(role: string | undefined): string {
    const roleObj = this.employeeRoles.find((r) => r.value === role);
    return roleObj ? roleObj.label : 'Agent de Nettoyage';
  }

  // Booking methods
assignEmployeeToBooking(bookingId: string, employeeId: string) {
  if (!employeeId) return;
  this.store.dispatch(
    CompanyActions.assignEmployeeToBooking({
      companyId: this.companyId,
      bookingId,
      employeeId,
    })
  );
}


  updateBookingStatus(bookingId: string, status: string): void {
    console.log('Updating booking status:', { bookingId, status });
  }
}
