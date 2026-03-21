import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Optional: check required roles if route has data.roles defined
    const requiredRoles: string[] = route.data['roles'] ?? [];
    if (requiredRoles.length > 0) {
      const userRoles = this.getUserRoles();
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));
      if (!hasRole) {
        this.router.navigate(['/']);
        return false;
      }
    }

    return true;
  }

  private getUserRoles(): string[] {
    try {
      const user = localStorage.getItem('user') || localStorage.getItem('company') || localStorage.getItem('client');
      if (!user) return [];
      const parsed = JSON.parse(user);
      return parsed?.roles ?? [];
    } catch {
      return [];
    }
  }
}
