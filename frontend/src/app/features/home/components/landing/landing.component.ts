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
    // Redirige vers la page des entreprises proches avec le paramètre de recherche
    this.router.navigate(['/nearby'], { queryParams: { q: this.searchQuery } });
  }

  goToNearby(): void {
    this.router.navigate(['/nearby']);
  }

  // Données pour la section "Pourquoi choisir NetProxi ?"
  features = [
    {
      icon: 'fas fa-magnifying-glass',
      title: 'Recherche rapide',
      description: 'Trouvez un professionnel près de chez vous en quelques secondes.'
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Réservation instantanée',
      description: 'Choisissez votre créneau et payez en ligne en toute sécurité.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Service garanti',
      description: 'Professionnels vérifiés et satisfaction remboursée.'
    }
  ];

  // Chiffres clés
  stats = [
    { value: '15 000+', label: 'ménages nettoyés' },
    { value: '250+', label: 'professionnels' },
    { value: '4.8', label: 'note moyenne' },
    { value: '98%', label: 'clients satisfaits' }
  ];

  // Témoignages clients
  testimonials = [
    {
      name: 'Marie L.',
      text: 'Service impeccable ! J’ai réservé en 5 minutes et le professionnel était très efficace. Je recommande !',
      rating: 5,
      service: 'Nettoyage profond'
    },
    {
      name: 'Thomas B.',
      text: 'Excellent rapport qualité/prix. Mon appartement n’a jamais été aussi propre.',
      rating: 5,
      service: 'Ménage mensuel'
    },
    {
      name: 'Sophie M.',
      text: 'Très professionnel et ponctuel. Je renouvelle régulièrement. Parfait pour les propriétaires.',
      rating: 5,
      service: 'Entretien courant'
    }
  ];
}