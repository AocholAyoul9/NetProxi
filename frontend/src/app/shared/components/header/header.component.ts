import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginModalComponent } from '../../../components/login-modal/login-modal.component';
import { SignupModalComponent } from '../../../components/signup-modal/signup-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterModule,SignupModalComponent, LoginModalComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  showLogin = false;
  showSignup = false;
  menuIsOpen = false;

  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  openLogin(){
    this.showLogin = true;
  }

  closeLogin() {
    this.showLogin = false;
  }
  openSignup(){
    this.showSignup = true;
  }

  closeSignup() {
    this.showSignup = false;
  }

}
