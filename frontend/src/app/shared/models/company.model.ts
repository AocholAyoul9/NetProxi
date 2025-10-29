export interface ServiceResponseDto {
  id?: string;
  name: string;
  description?: string;
  isPopular?: boolean; // Added for highlighting popular services
  basePrice?: number; // Added for service-specific pricing
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
  distance?: number; // Distance from user in km
  rating?: number;
  reviewsCount?: number;
  services?: ServiceResponseDto[];

  // Enhanced pricing information
  startingPrice?: number; // Starting price for services
  endingPrice?: number; // Maximum price for services
  minimumPrice?: number; // Minimum booking price
  pricingRange?: string; // Formatted price range (e.g., "€50 - €150")

  // Availability & operations
  openingHours?: string;
  isAvailableNow?: boolean; // Real-time availability
  responseTime?: number; // Average response time in hours

  // Trust & verification signals
  isVerified?: boolean; // Company verification status
  yearsExperience?: number; // Years in business
  employeeCount?: number; // Number of employees

  // Additional metadata
  specialties?: string[]; // Company specialties
  insuranceVerified?: boolean; // Insurance status
  languages?: string[]; // Languages spoken
}

// Optional: Create a more detailed company interface for the details page
export interface CompanyDetails extends Company {
  // Additional details for company profile page
  foundedYear?: number;
  serviceAreas?: string[]; // Areas they serve
  certifications?: string[]; // Professional certifications
  portfolioImages?: string[]; // Work portfolio
  teamMembers?: TeamMember[]; // Team information
  paymentMethods?: string[]; // Accepted payment methods
  cancellationPolicy?: string; // Cancellation policy
  averageResponseTime?: string; // Formatted response time
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

