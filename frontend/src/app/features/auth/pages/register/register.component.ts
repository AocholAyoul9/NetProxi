import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { register } from '../../state/auth.actions';
import { selectLoading, selectError } from '../../state/auth.selectors';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterPageComponent implements OnInit {
  accountType: 'client' | 'company' = 'client';

  formData = {
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  };

  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  @Output() close = new EventEmitter<void>();

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  onSubmit(): void {
    const { username, email, password, phone, address } = this.formData;
    if (!username || !email || !password) return;
    this.store.dispatch(register({ userData: { username, email, password, phone, address }, userType: this.accountType }));
  }

   @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}