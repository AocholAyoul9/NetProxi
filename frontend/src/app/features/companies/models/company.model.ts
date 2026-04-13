export interface ServiceResponseDto {
  id?: string;
  name: string;
  description?: string;
  isPopular?: boolean;
  basePrice?: number;
  durationInMinutes?: number;
  includedItems?: string[];
  beforeImage?: string;
  afterImage?: string;
  areaSize?: string;
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
  // Enhanced pricing information
  startingPrice?: number;
  endingPrice?: number; 
  minimumPrice?: number; 
  pricingRange?: string; 

  openingHours?: string;
  isAvailableNow?: boolean;
  responseTime?: number; 

  // Trust & verification signals
  isVerified?: boolean; 
  yearsExperience?: number; 
  employeeCount?: number; 

  specialties?: string[]; 
  insuranceVerified?: boolean;
  languages?: string[];
}

export interface CompanyDetails extends Company {
  foundedYear?: number;
  serviceAreas?: string[]; 
  certifications?: string[];
  portfolioImages?: string[];
  teamMembers?: TeamMember[];
  paymentMethods?: string[];
  cancellationPolicy?: string; 
  averageResponseTime?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  experience?: number;
  imageUrl?: string;
}

// Utility function to calculate price range
export function getPriceRange(company: Company): string {
  if (company.pricingRange) {
    return company.pricingRange;
  }

  if (company.startingPrice && company.endingPrice) {
    return `€${company.startingPrice} - €${company.endingPrice}`;
  }

  if (company.startingPrice) {
    return `À partir de €${company.startingPrice}`;
  }

  return 'Prix sur demande';
}

