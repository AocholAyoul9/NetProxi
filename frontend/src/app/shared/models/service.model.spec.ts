import { ServiceModel } from './service.model';

describe('Service', () => {
  it('should create an instance', () => {
    const service: ServiceModel = { id: '', name: '', description: '', price: '' };
    expect(service).toBeTruthy();
  });
});
