import { Component, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {
  @Output() closeModal = new EventEmitter<void>();
  
  selectedUserType: string = 'client';

  // Méthode pour fermer le modal
  close() {
    console.log('Fermeture du modal de connexion');
    this.closeModal.emit();
  }

  // Fermer avec la touche Escape
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.close();
  }

  // Gérer le changement de type d'utilisateur
  onUserTypeChange(userType: string) {
    this.selectedUserType = userType;
    console.log('Type d\'utilisateur sélectionné:', userType);
  }

  // Soumission du formulaire
  onSubmit(event: Event) {
    event.preventDefault();
    console.log('Connexion en tant que:', this.selectedUserType);
    // Logique de connexion ici
  }

  // Basculer la visibilité du mot de passe
  togglePasswordVisibility(passwordInput: HTMLInputElement) {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    // Changer l'icône
    const icon = passwordInput.nextElementSibling?.querySelector('i');
    if (icon) {
      icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    }
  }
}