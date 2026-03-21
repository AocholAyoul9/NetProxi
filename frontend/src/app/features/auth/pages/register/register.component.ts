import { Component, OnInit } from '@angular/core';
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
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  };
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  onSubmit(): void {
    const { name, email, password, phone, address } = this.formData;
    if (!name || !email || !password) return;
    this.store.dispatch(register({ userData: { name, email, password, phone, address }, userType: this.accountType }));
  }
}
