import { ServiceModel } from './service.model';

export interface Company {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  logoUrl: string;
  rating: number;
  latitude?: number;
  longitude?: number;
  distance: number;
  reviewsCount: string;
  services?: ServiceModel[];
}


export const FAKE_COMPANIES: Company[] = [
  {
    id: '1',
    name: 'ProClean Services',
    address: '12 Rue de Paris, 75001 Paris',
    phone: '+33 1 23 45 67 89',
    latitude: 48.8566,
    longitude: 2.3522,
    services: [
      {
        id: 's1', name: 'Bureaux',
        description: '',
        price: ''
      },
      {
        id: 's2', name: 'Vitres',
        description: '',
        price: ''
      }
    ],
    rating: 4.5,
    email: '',
    logoUrl: '',
    distance: 0,
    reviewsCount: ''
  },
  {
    id: '2',
    name: 'Nettoyage Express',
    address: '45 Avenue des Champs, 75008 Paris',
    phone: '+33 1 98 76 54 32',
    latitude: 48.8708,
    longitude: 2.3073,
    services: [
      {
        id: 's1', name: 'Tapis',
        description: '',
        price: ''
      },
      {
        id: 's2', name: 'Entretien complet',
        description: '',
        price: ''
      }
    ],
    rating: 4.8,
    email: '',
    logoUrl: '',
    distance: 0,
    reviewsCount: ''
  },
  {
    id: '3',
    name: 'Brillance Plus',
    address: '78 Boulevard Saint-Germain, 75005 Paris',
    phone: '+33 1 23 45 12 34',
    latitude: 48.8510,
    longitude: 2.3430,
    services: [
      {
        id: 's1', name: 'Bureaux',
        description: '',
        price: ''
      },
      {
        id: 's2', name: 'Entretien complet',
        description: '',
        price: ''
      }
    ],
    rating: 4.2,
    email: '',
    logoUrl: '',
    distance: 0,
    reviewsCount: ''
  },
  {
    id: '4',
    name: 'EcoClean Team',
    address: '23 Rue de Rivoli, 75004 Paris',
    phone: '+33 1 11 22 33 44',
    latitude: 48.8550,
    longitude: 2.3600,
    services: [
      {
        id: 's1', name: 'Vitres',
        description: '',
        price: ''
      },
      {
        id: 's2', name: 'Tapis',
        description: '',
        price: ''
      }
    ],
    rating: 4.7,
    email: '',
    logoUrl: '',
    distance: 0,
    reviewsCount: ''
  },
  {
    id: '5',
    name: 'Sparkle & Shine',
    address: '5 Quai de la Tournelle, 69200 Lyon',
    phone: '+33 1 44 55 66 77',
    latitude: 48.8495,
    longitude: 2.3540,
    services: [
      {
        id: 's1', name: 'Bureaux',
        description: '',
        price: ''
      },
      {
        id: 's2', name: 'Vitres',
        description: '',
        price: ''
      },
      {
        id: 's3', name: 'Entretien complet',
        description: '',
        price: ''
      }
    ],
    rating: 4.9,
    email: '',
    logoUrl: '',
    distance: 0,
    reviewsCount: ''
  }
];
