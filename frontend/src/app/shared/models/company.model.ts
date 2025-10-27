export interface ServiceResponseDto {
  id?: string;
  name: string;
}

export interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
  activePlan?: string;
  logoUrl?: string;
  website?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  rating?: number;
  reviewsCount?: number;
  services?: ServiceResponseDto[];
  pricing?: string;
  openingHours?: string;
}
