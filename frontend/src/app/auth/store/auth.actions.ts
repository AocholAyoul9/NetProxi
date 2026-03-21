import { createAction, props } from '@ngrx/store';
import { AuthUser } from '../models/user.model';

// Login
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string; userType: 'client' | 'company' | 'employee' }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: AuthUser; accessToken: string; userType: 'client' | 'company' | 'employee' }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Register
export const register = createAction(
  '[Auth] Register',
  props<{ userData: any; userType: 'client' | 'company' }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: any }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Logout
export const logout = createAction('[Auth] Logout');

// Refresh Token
export const refreshToken = createAction(
  '[Auth] Refresh Token',
  props<{ token: string }>()
);

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ accessToken: string }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

// Load Current User
export const loadCurrentUser = createAction('[Auth] Load Current User');

export const loadCurrentUserSuccess = createAction(
  '[Auth] Load Current User Success',
  props<{ user: AuthUser }>()
);

export const loadCurrentUserFailure = createAction(
  '[Auth] Load Current User Failure',
  props<{ error: string }>()
);

// ---------------------------------------------------------------------------
// Backward-compatible aliases kept so other parts of the app still compile
// ---------------------------------------------------------------------------
export const loginCompany = createAction(
  '[Auth] login company',
  props<{ email: string; password: string }>()
);
export const loginCompanySuccess = createAction(
  '[Auth] Login company Success',
  props<{ company: any; token: string }>()
);
export const loginCompanyFailure = createAction(
  '[Auth] Login company Failure',
  props<{ error: any }>()
);
export const logOut = createAction('[Auth] logOut company');

export const registerCompany = createAction(
  '[Auth] register company',
  props<{ company: any }>()
);
export const registerCompanySuccess = createAction(
  '[Auth] register company success',
  props<{ company: any }>()
);
export const registerCompanyFailure = createAction(
  '[Auth] register company Failure',
  props<{ error: any }>()
);

export const registerClient = createAction(
  '[Auth] register client',
  props<{ client: any }>()
);
export const registerClientSuccess = createAction(
  '[Auth] register client success',
  props<{ client: any }>()
);
export const registerClientFailure = createAction(
  '[Auth] register client Failure',
  props<{ error: any }>()
);

export const loginClient = createAction(
  '[Auth] login client',
  props<{ email: string; password: string }>()
);
export const loginClientSuccess = createAction(
  '[Auth] Login client Success',
  props<{ client: any; token: string }>()
);
export const loginClientFailure = createAction(
  '[Auth] Login client Failure',
  props<{ error: any }>()
);
export const logOutClient = createAction('[Auth] logOut client');

export const loginEmployee = createAction(
  '[Auth] login employee',
  props<{ email: string; password: string }>()
);
export const loginEmployeeSuccess = createAction(
  '[Auth] Login employee Success',
  props<{ employee: any; token: string }>()
);
export const loginEmployeeFailure = createAction(
  '[Auth] Login employee Failure',
  props<{ error: any }>()
);
export const logOutEmployee = createAction('[Auth] logOut employee');
