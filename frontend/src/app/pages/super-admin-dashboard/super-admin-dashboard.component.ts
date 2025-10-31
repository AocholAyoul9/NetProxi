/* super-admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { Company as CompanyResponseDto } from '../../shared/models/company.model';
//import * as AdminActions from '../../shared/state/admin/admin.actions';
//import * as AdminSelectors from '../../shared/state/admin/admin.selectors';

import * as AdminActions from '../../shared/state/company/company.actions';
import * as AdminSelectors from '../../shared/state/company/company.selectors';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent implements OnInit {
  companies$: Observable<CompanyResponseDto[]>;
  stats$: Observable<any>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.companies$ = this.store.select(AdminSelectors.selectAllCompanies);
    /*this.stats$ = this.store.select(AdminSelectors.selectAdminStats);
    this.loading$ = this.store.select(AdminSelectors.selectAdminLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(AdminActions.loadAdminDashboard());
  }

  toggleCompanyStatus(companyId: string, currentStatus: boolean): void {
    this.store.dispatch(AdminActions.toggleCompanyStatus({ 
      companyId, 
      active: !currentStatus 
    }));
  }

  updateCompanyPlan(companyId: string, newPlan: string): void {
    this.store.dispatch(AdminActions.updateCompanyPlan({ 
      companyId, 
      plan: newPlan 
    }));
  }
}*/

// super-admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Company as CompanyResponseDto } from '../../shared/models/company.model';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent implements OnInit {
  companies$: Observable<CompanyResponseDto[]>;
  stats$: Observable<any>;
  loading$: Observable<boolean>;

  constructor() {
    // Mock data
    this.companies$ = of(this.createMockCompanies());
    this.stats$ = of(this.createMockStats());
    this.loading$ = of(false);
  }

  ngOnInit(): void {
    // No API calls needed for mock data
  }

  toggleCompanyStatus(companyId: string, currentStatus: boolean): void {
    console.log('Toggling company status:', { companyId, currentStatus });
    // Mock implementation
  }

  updateCompanyPlan(companyId: string, newPlan: string): void {
    console.log('Updating company plan:', { companyId, newPlan });
    // Mock implementation
  }

  private createMockCompanies(): CompanyResponseDto[] {
    return [
      {
        id: '1',
        name: 'CleanPro Services',
        email: 'contact@cleanpro.com',
        phone: '+33 1 23 45 67 89',
        address: '123 Rue de Paris, Paris',
        active: true,
        activePlan: 'PREMIUM',
        logoUrl: '',
        website: 'https://cleanpro.com',
        description: 'Service de nettoyage professionnel',
        services: this.createMockServices()
      },
      {
        id: '2',
        name: 'Elite Cleaning',
        email: 'info@elitecleaning.com',
        phone: '+33 1 34 56 78 90',
        address: '456 Avenue Victor Hugo, Lyon',
        active: true,
        activePlan: 'BASIC',
        logoUrl: '',
        website: 'https://elitecleaning.com',
        description: 'Nettoyage haute qualité',
        services: this.createMockServices().slice(0, 2)
      },
      {
        id: '3',
        name: 'Quick Clean',
        email: 'service@quickclean.com',
        phone: '+33 1 45 67 89 01',
        address: '789 Boulevard de la République, Marseille',
        active: false,
        activePlan: 'FREE',
        logoUrl: '',
        website: 'https://quickclean.com',
        description: 'Service de nettoyage rapide',
        services: this.createMockServices().slice(0, 1)
      }
    ];
  }

  private createMockServices(): any[] {
    return [
      { id: '1', name: 'Nettoyage Résidentiel', basePrice: 80 },
      { id: '2', name: 'Nettoyage de Bureau', basePrice: 150 },
      { id: '3', name: 'Nettoyage après Déménagement', basePrice: 200 }
    ];
  }

  private createMockStats(): any {
    return {
      totalCompanies: 15,
      activeCompanies: 12,
      totalRevenue: 12500,
      totalBookings: 89
    };
  }
}