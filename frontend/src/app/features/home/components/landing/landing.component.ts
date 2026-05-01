import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  searchQuery = '';
  loading = signal(false);

  constructor(private router: Router) {}

  onSearch(): void {
    if (!this.searchQuery.trim()) return;

    this.loading.set(true);

    setTimeout(() => {
      this.loading.set(false);
      this.router.navigate(['/nearby'], {
        queryParams: { q: this.searchQuery }
      });
    }, 500);
  }

  goToNearby(): void {
    this.router.navigate(['/nearby']);
  }

  goToProSignup(): void {
    this.router.navigate(['/pro/signup']);
  }

  steps = [
    {
      icon: 'fas fa-search',
      title: '1. Recherchez',
      description: 'Trouvez une entreprise de nettoyage proche de vous'
    },
    {
      icon: 'fas fa-calendar-check',
      title: '2. Réservez',
      description: 'Choisissez un service et un créneau'
    },
    {
      icon: 'fas fa-user-check',
      title: '3. Intervention',
      description: 'Un agent est automatiquement assigné'
    }
  ];

  features = [
    {
      icon: 'fas fa-magnifying-glass',
      title: 'Recherche rapide',
      description: 'Trouvez un professionnel en quelques secondes'
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Réservation instantanée',
      description: 'Choisissez votre créneau facilement'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Service garanti',
      description: 'Professionnels vérifiés'
    }
  ];

  stats = [
    { value: '15 000+', label: 'ménages nettoyés' },
    { value: '250+', label: 'professionnels' },
    { value: '4.8', label: 'note moyenne' },
    { value: '98%', label: 'clients satisfaits' }
  ];

  testimonials = [
    {
      name: 'Marie L.',
      city: 'Lyon',
      text: 'Service impeccable et rapide'
    },
    {
      name: 'Thomas B.',
      city: 'Paris',
      text: 'Très bon rapport qualité/prix'
    },
    {
      name: 'Sophie M.',
      city: 'Marseille',
      text: 'Professionnel et ponctuel'
    }
  ];

  proBenefits = [
    'Nouvelles missions automatiques',
    'Gestion des employés simplifiée',
    'Planning optimisé'
  ];
}