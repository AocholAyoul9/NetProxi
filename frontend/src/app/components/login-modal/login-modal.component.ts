import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../shared/state/auth/auth.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent {

  @Output() closeModal = new EventEmitter<void>();

  constructor(private store: Store) {}

  selectedUserType = 'client';

  loginData = {
    email: '',
    password: ''
  };

  close() {
    this.closeModal.emit();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.close();
  }

  onUserTypeChange(type: string) {
    this.selectedUserType = type;
  }

  onSubmit(event: Event) {
    event.preventDefault();

    const { email, password } = this.loginData;

    if (!email || !password) {
      alert("Veuillez entrer votre email et mot de passe");
      return;
    }

    if (this.selectedUserType === 'company') {
      this.store.dispatch(AuthActions.loginCompany({ email, password }));
    }
    
    else if (this.selectedUserType === 'client') {
      this.store.dispatch(AuthActions.loginClient({ email, password }));
    }
    
    else if (this.selectedUserType === 'employee') {
      this.store.dispatch(AuthActions.loginEmployee({ email, password }));
    }

    this.close();
  }

  togglePasswordVisibility(input: HTMLInputElement) {
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';

    const icon = input.parentElement?.querySelector('.password-toggle i');
    if (icon) {
      icon.className = isHidden ? 'fas fa-eye-slash' : 'fas fa-eye';
    }
  }
}
