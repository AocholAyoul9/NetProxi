import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../auth/store/auth.actions';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup-modal.component.html',
  styleUrls: ['./signup-modal.component.scss'], // fix: was styleUrl
})
export class SignupModalComponent {
  constructor(private store: Store) {}

  @Output() closeModal = new EventEmitter<void>();
  @Output() signupSuccess = new EventEmitter<any>();

  accountType: 'client' | 'company' = 'client';
  isLoading = false;

  formData = {
    email: '',
    password: '', // you will override with default
    phone: '',
    firstName: '', // client
    companyName: '', // company
    address: '',
    website: '',
    description: '',
    latitude: 0,
    longitude: 0,
    logoUrl: '',
    acceptedTerms: false,
  };

  // Close modal
  close() {
    this.closeModal.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event) {
    this.close();
  }

  onAccountTypeChange(type: 'client' | 'company') {
    this.accountType = type;
  }

  // Form submission
  async onSubmit(event: Event) {
    event.preventDefault();

    if (!this.formData.acceptedTerms) {
      alert("Veuillez accepter les conditions d'utilisation");
      return;
    }

    this.isLoading = true;

    try {
      if (this.accountType === 'client') {
        this.registerClient();
      } else {
        await this.registerCompany();
      }

      this.close();
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    } finally {
      this.isLoading = false;
    }
  }

  private registerClient() {
    const clientData = {
      name: this.formData.firstName,
      email: this.formData.email,
      address: this.formData.address,
      password: this.formData.password || '12345', // default password
      phone: this.formData.phone,
    };

    this.store.dispatch(AuthActions.registerClient({ client: clientData }));
  }

  private async registerCompany() {
    await this.getCurrentLocation();

    const companyData = {
      name: this.formData.companyName,
      address: this.formData.address,
      email: this.formData.email,
      password: this.formData.password || '12345', // default password
      phone: this.formData.phone,
      latitude: this.formData.latitude || 0,
      longitude: this.formData.longitude || 0,
      logoUrl: this.formData.logoUrl || '',
      website: this.formData.website,
      description: this.formData.description,
      token: '',
      pricing: 'Contactez-nous pour les tarifs',
      openingHours: 'Lundi - Vendredi: 9h-18h',
    };

    this.store.dispatch(AuthActions.registerCompany({ company: companyData }));
  }

  private async getCurrentLocation(): Promise<void> {
    if (this.accountType === 'company' && navigator.geolocation) {
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.formData.latitude = position.coords.latitude;
            this.formData.longitude = position.coords.longitude;
            resolve();
          },
          (error) => {
            console.warn('Impossible d\'obtenir la géolocalisation:', error);
            resolve();
          }
        );
      });
    }
  }
}
