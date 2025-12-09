import {createAction, props} from '@ngrx/store';
import {Company} from '../../models/company.model';
import {Client} from '../../models/client.model';



//login company
export const loginCompany = createAction(
    '[Auth] login company',
    props<{email: string; password: string}>()
);

export const loginCompanySuccess = createAction(
    '[Auth] Login company Success',
    props<{company: any; token: string}>()
);

export const loginCompanyFailure = createAction(
    '[Auth] Login company Failure',
    props<{error: any}>()
)

//logout company
export const logOutCompany = createAction('[Auth] logOut company')

//register company

export const registerCompany = createAction('[Auth] register company',
    props<{company: Partial<Company>}>()
)

export const registerCompanySuccess = createAction('[Auth] register company success',
    props<{company: Company}>()
)

export const registerCompanyFailure = createAction('[Auth] register company Failure',
    props<{error: any}>()
)

//register client

export const registerClient = createAction('[Auth] register client',
    props<{client: Partial<Client>}>()
)

export const registerClientSuccess = createAction('[Auth] register client success',
    props<{client: Client}>()
)

export const registerClientFailure = createAction('[Auth] register client Failure',
    props<{error: any}>()
)

//login client
export const loginClient = createAction(
    '[Auth] login client',
    props<{email: string; password: string}>()
);
export const loginClientSuccess = createAction(
    '[Auth] Login client Success',
    props<{client: any; token: string}>()
);
export const loginClientFailure = createAction(
    '[Auth] Login client Failure',
    props<{error: any}>()
)
