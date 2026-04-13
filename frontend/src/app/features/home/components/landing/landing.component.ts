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
    // Navigate to nearby companies with search query
    this.router.navigate(['/companies'], { 
      queryParams: { q: this.searchQuery } 
    });
  }

  goToNearby(): void {
    this.router.navigate(['/companies']);
  }

  features = [
    {
      icon: 'fa-search',
      title: 'Trouvez rapidement',
      description: 'Recherchez des professionnels près de chez vous en quelques secondes'
    },
    {
      icon: 'fa-calendar-check',
      title: 'Réservez en ligne',
      description: 'Planifiez votre nettoyage en 3 clics, 24h/24 et 7j/7'
    },
    {
      icon: 'fa-star',
      title: 'Services garantis',
      description: 'Profesionnels vérifiés avec avis clients authentiques'
    }
  ];

  stats = [
    { value: '15,000+', label: 'ménages nettoyés' },
    { value: '250+', label: 'professionnels' },
    { value: '4.8', label: 'note moyenne' },
    { value: '98%', label: 'clients satisfaits' }
  ];

  testimonials = [
    {
      name: 'Marie L.',
      text: 'Service impeccable ! J\'ai réservé en 5 minutes et le professionnel était très efficace. Je recommande !',
      rating: 5,
      service: 'Nettoyage profond'
    },
    {
      name: 'Thomas B.',
      text: 'Excellent rapport qualité/prix. Mon appartement n\'a jamais été aussi propre. Merci NetProxi !',
      rating: 5,
      service: ' Ménage mensuel'
    },
    {
      name: 'Sophie M.',
      text: 'Très professionnel et ponctuel. Je renouvelle régulièrement. Parfait pour les propriétaires comme moi.',
      rating: 5,
      service: 'Entretien квартиры'
    }
  ];
}