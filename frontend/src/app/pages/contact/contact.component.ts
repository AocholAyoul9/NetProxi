import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';

  submitForm() {
    alert(`Merci ${this.name}, votre message a été envoyé !`);
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
