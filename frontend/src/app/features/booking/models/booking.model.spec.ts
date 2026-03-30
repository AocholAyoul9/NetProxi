import { Booking } from './booking.model';

describe('Booking', () => {
  it('should create an instance', () => {
    const booking: Booking = {
      id: '',
      companyId: '',
      companyName: '',
      clientId: '',
      clientName: '',
      serviceId: '',
      serviceName: '',
      servicePrice: 0,
      serviceDuration: 0,
      startTime: '',
      endTime: new Date(),
      address: '',
      price: 0,
      status: ''
    };
    expect(booking).toBeTruthy();
  });
});
