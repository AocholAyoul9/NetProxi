import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { login } from '../../state/auth.actions';
import { selectLoading, selectError } from '../../state/auth.selectors';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginPageComponent implements OnInit {
  loginData = { email: '', password: '', userType: 'client' as 'client' | 'company' | 'employee' };
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  onSubmit(): void {
    const { email, password, userType } = this.loginData;
    if (!email || !password) return;
    this.store.dispatch(login({ email, password, userType }));
  }
}
