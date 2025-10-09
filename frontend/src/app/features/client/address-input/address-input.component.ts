import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ClientActions from '../../../shared/state/client/client.actions';
import { ClientState } from '../../../shared/state/client/client.reducer';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-address-input',
  imports: [  CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.css'
})
export class AddressInputComponent {

  address: string = '';

  constructor(private store: Store<{ client: ClientState }>) { }

  searchCompanies(){
    if(this.address.trim()){
    this.store.dispatch(ClientActions.setAddress({
      address: this.address,
      lat: 0,
      lng: 0
    }));
    this.store.dispatch(ClientActions.loadNearbyCompanies());
    }
  }

  clearAddress() {
    this.address = '';
  }
}
