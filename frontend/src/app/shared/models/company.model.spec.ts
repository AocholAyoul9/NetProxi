import { Company } from './company.model';

describe('Company', () => {
  it('should create an instance', () => {
    const company: Company = { id: '', name: '' };
    expect(company).toBeTruthy();
  });
});
