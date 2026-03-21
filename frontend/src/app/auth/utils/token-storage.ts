const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  // Also check legacy 'token' key for backward compatibility
  return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem('token');
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  // Store under legacy key for backward compatibility
  localStorage.setItem('token', token);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('token');
  localStorage.removeItem('client');
  localStorage.removeItem('company');
  localStorage.removeItem('employee');
  localStorage.removeItem('employeeId');
}
