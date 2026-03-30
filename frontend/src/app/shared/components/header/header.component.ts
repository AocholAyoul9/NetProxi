import { Component, signal, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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


export class HeaderComponent {
  isAuthenticated$!: Observable<boolean>;
  currentUser$!: Observable<any>;
  currentUserType$!: Observable<'client' | 'company' | 'employee' | null>;

  currentTheme: ThemeMode;

  showLogin = false;
  showSignup = false;
  menuOpen = signal(false);

  constructor(private store: Store, private themeService: ThemeService) {
    this.currentTheme = this.themeService.getTheme();

    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.currentUserType$ = this.store.select(selectCurrentUserType);

    this.currentUser$
      .pipe(takeUntilDestroyed())
      .subscribe((user) => {
        if (user) {
          this.showLogin = false;
          this.showSignup = false;
        }
      });
  }

  setTheme(theme: ThemeMode): void {
    this.currentTheme = theme;
    this.themeService.setTheme(theme);
    this.menuOpen.set(false);
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  openLogin() { this.showLogin = true; }
  closeLogin() { this.showLogin = false; }

  openSignup() { this.showSignup = true; }
  closeSignup() { this.showSignup = false; }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}