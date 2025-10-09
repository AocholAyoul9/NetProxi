import {createAction, props} from '@ngrx/store';
import {User} from '../../models/user.model';

//login
export const login = createAction(
    '[Auth] login',
    props<{email: string; password: string}>()
);

export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{user: User; token: string}>()
);

export const loginFailure = createAction(
    '[Auth] Login Failure',
    props<{error: any}>()
)

//logout
export const logOut = createAction('[Auth] logOut')

//register

export const register = createAction('[Auth] register',
    props<{user: Partial<User>}>()
)

export const registerSuccess = createAction('[Auth] register success',
    props<{user: User}>()
)

export const registerFailure = createAction('[Auth] register Failure',
    props<{error: any}>()
)