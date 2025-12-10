export interface Booking {
  id: string;

  // --- Client ---
  clientId: string;
  clientName: string;

  // --- Company ---
  companyId: string;
  companyName: string;
  companyLogoUrl?: string;
  companyAddress: string;

  employeeId: string;
  // --- Service ---
  serviceId: string;
  serviceName: string;
  serviceDescription: string;
  servicePrice: number;
  serviceDuration: number;

  // --- Booking time ---
  startTime: Date;
  endTime: Date;

  bookingDate: Date;   // (if startTime exists, bookingDate = startTime)
  bookingTime: Date;   // (also = startTime, just separated for UI)

  // --- Address ---
  address: string;

  // --- Financial ---
  price: number;

  // --- Status ---
  status: string;  
  // OR strongly typed:
  // status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

  // --- Employee assigned ---
  assignedEmployeeId: string;
  assignedEmployeeName: string;

  // --- Notes / Review ---
  clientNotes?: string;
  companyNotes?: string;
  rating?: number;  
  review?: string;

  // --- Tracking ---
  estimatedArrivalTime?: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
}
