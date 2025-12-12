export interface Client{
  id: string,
 name: string,
  email: string,
  password: string,
  phone: string,
  address: string,
  token: string
}



export interface NearbyCompany {
  id: string;
  name: string;
  logoUrl?: string;
  address: string;
  distance: number; // en km
  rating: number;
  isFavorite: boolean;
  services: CompanyService[];
  selectedService?: CompanyService | null;
}

export interface CompanyService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // en minutes
  category: string;
}

export interface ClientDashboardStats {
  totalReservations: number;
  upcomingReservations: number;
  completedReservations: number;
  cancelledReservations: number;
  totalSpent: number;
  favoriteCompanies: string[];
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  joinDate: Date;
}