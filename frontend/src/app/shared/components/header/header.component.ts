import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginModalComponent } from '../../../components/login-modal/login-modal.component';
import { SignupModalComponent } from '../../../components/signup-modal/signup-modal.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentCompany, selectIsCompanyLoggedIn ,selectIsClientLoggedIn, selectClient} from '../../../features/auth/state/auth.selectors';
import * as AuthActions from '../../../features/auth/state/auth.actions';
import { ThemeService, ThemeMode } from '../../../core/services/theme.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    SignupModalComponent,
    LoginModalComponent,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isCompanyLoggedIn$: Observable<boolean>;
  isClientLoggedIn$: Observable<boolean>;
  company$: Observable<any>;
  client$: Observable<any>;

  currentTheme: ThemeMode;

  constructor(private store: Store, private themeService: ThemeService) {
    this.isCompanyLoggedIn$ = this.store.select(selectIsCompanyLoggedIn);
    this.isClientLoggedIn$ = this.store.select(selectIsClientLoggedIn);
    this.company$ = this.store.select(selectCurrentCompany);
    this.client$ = this.store.select(selectClient);
    this.currentTheme = this.themeService.getTheme();
  }

  showLogin = false;
  showSignup = false;
  menuIsOpen = false;

  menuOpen = signal(false);

  setTheme(theme: string): void {
    this.currentTheme = theme as ThemeMode;
    this.themeService.setTheme(this.currentTheme);
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  openLogin() {
    this.showLogin = true;
  }

  closeLogin() {
    this.showLogin = false;
  }
  openSignup() {
    this.showSignup = true;
  }

  closeSignup() {
    this.showSignup = false;
  }

  logoutCompany() {
    this.store.dispatch(AuthActions.logOut());
  }
  logoutClient() {
    this.store.dispatch(AuthActions.logOutClient());
  }
}
