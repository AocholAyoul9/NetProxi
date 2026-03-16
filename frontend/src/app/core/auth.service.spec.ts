import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';

import { AuthService } from './auth.service';
import { User } from '../shared/models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to login endpoint and store token and user', () => {
    const mockUser: User = { id: '1', name: 'Test User', email: 'test@example.com', address: '', phone: '' };
    const mockResponse = { token: 'test-jwt-token', user: mockUser };

    service.login('test@example.com', 'password').subscribe(res => {
      expect(res.token).toBe('test-jwt-token');
      expect(localStorage.getItem('token')).toBe('test-jwt-token');
      expect(JSON.parse(localStorage.getItem('user')!)).toEqual(mockUser);
    });

    const req = httpMock.expectOne('http://localhost:8082/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password' });
    req.flush(mockResponse);
  });

  it('should update currentUser$ after login', () => {
    const mockUser: User = { id: '2', name: 'Jane', email: 'jane@example.com', address: '', phone: '' };
    const mockResponse = { token: 'jwt-abc', user: mockUser };

    service.login('jane@example.com', 'pass').subscribe();

    const req = httpMock.expectOne('http://localhost:8082/api/auth/login');
    req.flush(mockResponse);

    service.currentUser$.subscribe(user => {
      expect(user).toEqual(mockUser);
    });
  });

  it('should return the token from localStorage', () => {
    localStorage.setItem('token', 'my-token');
    expect(service.getToken()).toBe('my-token');
  });

  it('should return null when no token is stored', () => {
    expect(service.getToken()).toBeNull();
  });

  it('should return null for getCurrentUser when not logged in', () => {
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should logout and clear storage then navigate to /login', () => {
    localStorage.setItem('token', 'some-token');
    localStorage.setItem('user', JSON.stringify({ id: '1', name: 'User', email: '', address: '', phone: '' }));
    spyOn(router, 'navigate');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(service.getCurrentUser()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return Authorization header with Bearer token when token exists', () => {
    localStorage.setItem('token', 'my-jwt-token');
    const headers = service.getAuthHeaders();
    expect(headers.get('Authorization')).toBe('Bearer my-jwt-token');
  });

  it('should return empty Authorization header when no token stored', () => {
    const headers = service.getAuthHeaders();
    expect(headers.get('Authorization')).toBe('');
  });
});
