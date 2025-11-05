import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ← Add this
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup-modal',
  imports: [FormsModule, CommonModule],
  templateUrl: './signup-modal.component.html',
  styleUrl: './signup-modal.component.scss'
})
export class SignupModalComponent {

  @Output() closeModal = new EventEmitter<void>();
  @Output() signupSuccess = new EventEmitter<any>();

  accountType: 'client' | 'company' = 'client';
  isLoading = false;

  formData = {
    email: '',
    password: '',
    phone: '',
    
    // Client fields
    firstName: '',
    lastName: '',
    
    // Company fields
    companyName: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    website: '',
    description: '',
    
    // Common
    acceptedTerms: false
  };

  // Méthode pour fermer le modal
  close() {
    this.closeModal.emit();
  }

  // Fermer avec la touche Escape
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.close();
  }

  // Changer le type de compte
  onAccountTypeChange(type: 'client' | 'company') {
    this.accountType = type;
    console.log('Type de compte sélectionné:', type);
  }

  // Soumission du formulaire
  async onSubmit(event: Event) {
    event.preventDefault();
    
    if (!this.formData.acceptedTerms) {
      alert('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    this.isLoading = true;

    try {
      let result;
      
      if (this.accountType === 'client') {
        result = await this.registerClient();
      } else {
        result = await this.registerCompany();
      }

      this.signupSuccess.emit(result);
      this.close();
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    } finally {
      this.isLoading = false;
    }
  }

  // Inscription Client
  private async registerClient() {
    const clientData = {
      email: this.formData.email,
      password: this.formData.password,
      phone: this.formData.phone,
      firstName: this.formData.firstName,
      lastName: this.formData.lastName
    };

    // Appel API pour l'inscription client
    const response = await fetch('/api/auth/register/client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'inscription client');
    }

    return await response.json();
  }

  // Inscription Entreprise
  private async registerCompany() {
    const companyData = {
      name: this.formData.companyName,
      email: this.formData.email,
      password: this.formData.password,
      phone: this.formData.phone,
      address: this.formData.address,
      latitude: this.formData.latitude,
      longitude: this.formData.longitude,
      website: this.formData.website,
      description: this.formData.description,
      pricing: "Contactez-nous pour les tarifs", // Valeur par défaut
      openingHours: "Lundi - Vendredi: 9h-18h"   // Valeur par défaut
    };

    // Appel API pour l'inscription entreprise
    const response = await fetch('/api/auth/register/company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(companyData)
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'inscription entreprise');
    }

    return await response.json();
  }

  // Géolocalisation automatique pour l'entreprise
  async getCurrentLocation() {
    if (this.accountType === 'company' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.formData.latitude = position.coords.latitude;
          this.formData.longitude = position.coords.longitude;
        },
        (error) => {
          console.warn('Impossible d\'obtenir la géolocalisation:', error);
        }
      );
    }
  }
}
