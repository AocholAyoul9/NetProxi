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
