import { Booking } from './booking.model';

describe('Booking', () => {
  it('should create an instance', () => {
    const booking: Booking = { companyId: '', serviceId: '', startTime: '', address: '' };
    expect(booking).toBeTruthy();
  });
});
