import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginModalComponent } from '../../../components/login-modal/login-modal.component';
import { SignupModalComponent } from '../../../components/signup-modal/signup-modal.component';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentCompany, selectIsCompanyLoggedIn ,selectIsClientLoggedIn, selectClient} from '../../../auth/store/auth.selectors';
import * as AuthActions from '../../../auth/store/auth.actions';

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

  constructor(private store
    : Store) {
    this.isCompanyLoggedIn$ = this.store.select(selectIsCompanyLoggedIn);
    this.isClientLoggedIn$ = this.store.select(selectIsClientLoggedIn);
    this.company$ = this.store.select(selectCurrentCompany);
    this.client$ = this.store.select(selectClient);

  }

  showLogin = false;
  showSignup = false;
  menuIsOpen = false;

  menuOpen = signal(false);

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
