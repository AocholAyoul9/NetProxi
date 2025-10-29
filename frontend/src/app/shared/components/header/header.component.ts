import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  openLogin(){}
  openSignup(){}

}
