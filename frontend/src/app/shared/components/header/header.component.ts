import { Component, signal, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterPageComponent } from '../../../features/auth/pages/register/register.component';
import { LoginPageComponent } from '../../../features/auth/pages/login/login.component';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectCurrentUser,
  selectCurrentUserType,
  selectIsAuthenticated,
} from '../../../features/auth/state/auth.selectors';
import * as AuthActions from '../../../features/auth/state/auth.actions';
import { ThemeService, ThemeMode } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, RegisterPageComponent, LoginPageComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true
})
export class HeaderComponent implements OnDestroy {
  // Observables for authentication
  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<any>;
  currentUserType$: Observable<'client' | 'company' | 'employee' | null>;

  currentTheme: ThemeMode;

  // Local UI state
  showLogin = false;
  showSignup = false;
  menuOpen = signal(false);

  // Subscription container
  private authSub: Subscription;

  constructor(private store: Store, private themeService: ThemeService) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.currentUserType$ = this.store.select(selectCurrentUserType);

    this.currentTheme = this.themeService.getTheme();

    // ✅ Close modals automatically when user logs in/registers
    this.authSub = this.currentUser$.subscribe((user) => {
      if (user) {
        this.showLogin = false;
        this.showSignup = false;
      }
    });
  }

  // Theme switching
  setTheme(theme: string): void {
    this.currentTheme = theme as ThemeMode;
    this.themeService.setTheme(this.currentTheme);
  }

  // Menu toggle
  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  // Login modal
  openLogin() {
    this.showLogin = true;
  }
  closeLogin() {
    this.showLogin = false;
  }

  // Signup modal
  openSignup() {
    this.showSignup = true;
  }
  closeSignup() {
    this.showSignup = false;
  }

  // Unified logout
  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  // Clean up subscription
  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  
}