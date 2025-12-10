export interface Client{
  id: string,
 name: string,
  email: string,
  password: string,
  phone: string,
  address: string,
  token: string
}



export interface ClientReservation {
  id: string;
  companyId: string;
  clientId: string;
  employeeId: string;
  companyName: string;
  companyLogoUrl?: string;
  companyAddress: string;
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  servicePrice: number;
  serviceDuration: number;
  bookingDate: Date;
  bookingTime: Date;
  // Accepter les strings ou les valeurs spécifiques
  status: string; // ou | 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  assignedEmployeeName?: string;
  assignedEmployeeId?: string;
  clientNotes?: string;
  companyNotes?: string;
  rating?: number;
  review?: string;
  estimatedArrivalTime?: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;

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