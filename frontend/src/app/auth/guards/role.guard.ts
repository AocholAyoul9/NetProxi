import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { selectUserType } from '../store/auth.selectors';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const router = inject(Router);
  const expectedRoles: string[] = route.data['roles'] ?? [];

  return store.select(selectUserType).pipe(
    take(1),
    map((userType) => {
      if (userType && expectedRoles.includes(userType)) return true;
      return router.createUrlTree(['/']);
    })
  );
};
