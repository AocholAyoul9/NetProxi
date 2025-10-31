// company-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Company, getPriceRange,ServiceResponseDto } from '../../shared/models/company.model';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as CompanyActions from '../../shared/state/company/company.actions';
import * as CompanySelectors from '../../shared/state/company/company.selectors';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  
  company$!: Observable<Company | null>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.store.dispatch(CompanyActions.loadCompany({ id: companyId }));
    }

    this.company$ = this.store.select(CompanySelectors.selectCurrentCompany);
    this.loading$ = this.store.select(CompanySelectors.selectCompanyLoading);
    this.error$ = this.store.select(CompanySelectors.selectCompanyError);
  }

  // Get initials for avatar placeholder
  getInitials(companyName: string): string {
    if (!companyName) return 'N';
    
    return companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Get formatted price range
  getPriceRange(company: Company): string {
    return getPriceRange(company);
  }

  // Navigate to booking page with preselected service
  selectService(service: ServiceResponseDto): void {
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.router.navigate(['/booking', companyId], {
        queryParams: { service: service.id }
      });
    }
  }

  // Navigate to general booking page
  goToBooking(): void {
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.router.navigate(['/booking', companyId]);
    }
  }

  // Retry loading company details
  retry(): void {
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.store.dispatch(CompanyActions.loadCompany({ id: companyId }));
    }
  }

  // Format phone number for display
  formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    
    // Simple formatting for French phone numbers
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    return phone;
  }

  // Check if company is currently open (simplified)
  isCompanyOpen(openingHours?: string): boolean {
    if (!openingHours) return true; // Default to open if no hours specified
    
    // Simple check - you might want to implement more sophisticated logic
    const now = new Date();
    const hour = now.getHours();
    
    // Assume typical business hours if not specified in detail
    return hour >= 8 && hour < 18;
  }

  // Get response time with proper formatting
  getResponseTime(responseTime?: number): string {
    if (!responseTime) return 'Rapidement';
    
    if (responseTime < 1) {
      return 'Moins d\'une heure';
    } else if (responseTime === 1) {
      return '1 heure';
    } else {
      return `${responseTime} heures`;
    }
  }
}