import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AddressInputComponent } from './features/client/address-input/address-input.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,AddressInputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
