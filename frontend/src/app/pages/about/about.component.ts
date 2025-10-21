import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  // Target stats
  totalClients = 1200;
  totalCompanies = 75;
  totalBookings = 5400;

  // Animated signals
  clients = signal(0);
  companies = signal(0);
  bookings = signal(0);

  constructor() {
    this.animateCounters();
  }

  animateCounters() {
    const duration = 2000; // animation duration in ms
    const interval = 30; // interval in ms
    const steps = duration / interval;

    let cStep = this.totalClients / steps;
    let compStep = this.totalCompanies / steps;
    let bStep = this.totalBookings / steps;

    const counter = setInterval(() => {
      if (this.clients() < this.totalClients) this.clients.set(Math.min(this.clients() + cStep, this.totalClients));
      if (this.companies() < this.totalCompanies) this.companies.set(Math.min(this.companies() + compStep, this.totalCompanies));
      if (this.bookings() < this.totalBookings) this.bookings.set(Math.min(this.bookings() + bStep, this.totalBookings));

      if (this.clients() === this.totalClients && this.companies() === this.totalCompanies && this.bookings() === this.totalBookings) {
        clearInterval(counter);
      }
    }, interval);
  }
}
