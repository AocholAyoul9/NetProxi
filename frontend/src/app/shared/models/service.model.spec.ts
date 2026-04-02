import { ServiceModel } from './service.model';

describe('Service', () => {
  it('should create an instance', () => {
    const service: ServiceModel = { id: '', name: '', description: '', basePrice: 0 , durationInMinutes: 0, companyId: '' };
    expect(service).toBeTruthy();
  });
});
