// company-detail.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Company, getPriceRange,ServiceResponseDto } from '../../models/company.model';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import * as CompanyActions from '../../state/company.actions';
import * as CompanySelectors from '../../state/company.selectors';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompaniesApiService } from '../../services/companies.api';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  
  company$!: Observable<Company | null>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  // Booking state
  bookingModalOpen = signal(false);
  bookingCompany = signal<Company | null>(null);
  selectedService = signal('');
  selectedDate = signal('');
  selectedTime = signal('');
  bookingSuccess = signal(false);
  bookingLoading = signal(false);
  bookingStep = signal(1);
  
  bookingForm = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    propertyType: 'apartment',
    rooms: '2',
    surface: 0,
    notes: '',
  };

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private api: CompaniesApiService
  ) {}

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.store.dispatch(CompanyActions.loadCompany({ companyId: companyId }));
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

  bookCompany(company: Company): void {
    this.bookingCompany.set(company);
    this.selectedService.set(company.services?.[0]?.id || '');
    this.bookingSuccess.set(false);
    this.bookingStep.set(1);
    this.bookingForm = {
      fullName: '',
      email: '',
      phone: '',
      address: company.address || '',
      propertyType: 'apartment',
      rooms: '2',
      surface: 0,
      notes: '',
    };
    this.bookingModalOpen.set(true);
  }

  closeBookingModal(): void {
    this.bookingModalOpen.set(false);
    this.bookingCompany.set(null);
    this.selectedService.set('');
    this.selectedDate.set('');
    this.selectedTime.set('');
    this.bookingSuccess.set(false);
  }

  nextBookingStep(): void {
    if (this.bookingStep() < 3) {
      this.bookingStep.update(s => s + 1);
    }
  }

  prevBookingStep(): void {
    if (this.bookingStep() > 1) {
      this.bookingStep.update(s => s - 1);
    }
  }

  confirmBooking(): void {
    const company = this.bookingCompany();
    const serviceId = this.selectedService();
    if (!company || !serviceId || !this.selectedDate() || !this.selectedTime()) return;

    this.bookingLoading.set(true);
    
    let clientId: string | null = localStorage.getItem('clientId');
    
    const createBooking = (cid: string) => {
      const dateStr = this.selectedDate();
      const timeStr = this.selectedTime();
      const dateTimeStr = `${dateStr}T${timeStr}:00`;
      
      const bookingRequest = {
        clientId: cid,
        serviceId: serviceId,
        address: this.bookingForm.address,
        startTime: dateTimeStr,
        price: 0,
      };
      
      this.api.CreateBooking(company.id, bookingRequest).subscribe({
        next: () => {
          this.bookingLoading.set(false);
          this.bookingSuccess.set(true);
        },
        error: (err) => {
          console.error('Booking error:', err);
          this.bookingLoading.set(false);
          alert('Erreur lors de la réservation');
        }
      });
    };
    
    if (clientId) {
      createBooking(clientId);
    } else {
      const clientData = {
        name: this.bookingForm.fullName,
        email: this.bookingForm.email,
        password: 'TempPass123!',
        phone: this.bookingForm.phone,
        address: this.bookingForm.address,
      };
      
      this.api.registerClient(clientData).subscribe({
        next: (response) => {
          const newClientId = response.id;
          if (newClientId) {
            localStorage.setItem('clientId', newClientId);
            createBooking(newClientId);
          }
        },
        error: () => {
          this.bookingLoading.set(false);
          alert('Erreur lors de l\'inscription');
        }
      });
    }
  }

  getServiceName(serviceId: string): string {
    const company = this.bookingCompany();
    if (!company || !company.services) return '';
    const service = company.services.find(s => s.id === serviceId);
    return service ? service.name : '';
  }

  getServices(company: Company): ServiceResponseDto[] {
    return company.services || [];
  }

  get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Retry loading company details
  retry(): void {
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.store.dispatch(CompanyActions.loadCompany({ companyId: companyId }));
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
    if (!openingHours) return true;
    
    const now = new Date();
    const hour = now.getHours();
    
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