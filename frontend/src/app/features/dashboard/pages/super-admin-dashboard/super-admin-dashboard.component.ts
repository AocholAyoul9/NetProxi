//super-admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { Company as CompanyResponseDto } from '../../../companies/models/company.model';

import * as AdminActions from '../../../companies/state/company.actions';
import * as AdminSelectors from '../../../companies/state/company.selectors';

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
     this.stats$ = this.store.select(AdminSelectors.selectCompanyStats);

    //this.loading$ = this.store.select(AdminSelectors.selectAdminLoading);
    this.loading$ = of(false);
  }

  ngOnInit(): void {
    this.store.dispatch(AdminActions.loadAllCompanies());
  }

  toggleCompanyStatus(companyId: string, currentStatus: boolean): void {
   /* this.store.dispatch(AdminActions.toggleCompanyStatus({ 
      companyId, 
      active: !currentStatus 
    }));*/
  }

  updateCompanyPlan(companyId: string, newPlan: string): void {
   /* this.store.dispatch(AdminActions.updateCompanyPlan({ 
      companyId, 
      plan: newPlan 
    }));*/
  }
}

