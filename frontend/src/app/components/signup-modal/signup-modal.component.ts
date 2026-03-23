import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { register } from '../../features/auth/state/auth.actions';
import { selectLoading, selectError } from '../../features/auth/state/auth.selectors';

@Component({
  selector: 'app-signup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="closeModal()">&times;</button>
        <h2>Sign Up</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" [(ngModel)]="signupData.name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="signupData.email" name="email" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" [(ngModel)]="signupData.password" name="password" required>
          </div>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input type="tel" id="phone" [(ngModel)]="signupData.phone" name="phone" required>
          </div>
          <div class="form-group">
            <label for="userType">Register as</label>
            <select id="userType" [(ngModel)]="signupData.userType" name="userType">
              <option value="client">Client</option>
              <option value="company">Company</option>
            </select>
          </div>
          <div *ngIf="error$ | async as error" class="error-message">{{ error }}</div>
          <button type="submit" [disabled]="loading$ | async">Sign Up</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 400px;
      max-width: 90%;
      position: relative;
    }
    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
    }
    .form-group input, .form-group select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .error-message {
      color: red;
      margin-bottom: 1rem;
    }
    button[type="submit"] {
      width: 100%;
      padding: 0.75rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class SignupModalComponent {
  @Output() close = new EventEmitter<void>();
  
  signupData = { 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    userType: 'client' as 'client' | 'company' 
  };
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(private store: Store, private router: Router) {
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  onSubmit(): void {
    const { name, email, password, phone, userType } = this.signupData;
    if (!name || !email || !password || !phone) return;
    
    if (userType === 'client') {
      this.store.dispatch(register({ 
        userData: { name, email, password, phone }, 
        userType: 'client' 
      }));
    }
    // For company signup, navigate to company registration page
    else if (userType === 'company') {
      this.router.navigate(['/company/register']);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
