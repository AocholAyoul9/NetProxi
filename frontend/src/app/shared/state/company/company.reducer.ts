import { createReducer, on } from "@ngrx/store";
import * as CompanyAction from './company.actions';
import { Company } from "../../models/company.model";


export interface CompanyState{
    currentCompany: Company | null;
    nearbyCompanies: Company[];
    loading: boolean;
    error: any;
}

export const initialState: CompanyState ={
    currentCompany: null,
    nearbyCompanies: [],
    loading: false,
    error: null
}

export const companyReducer = createReducer(
    initialState,
    on(CompanyAction.loadCompany, state =>({...state, loading: true})),
    on(CompanyAction.loadCompanySuccess, (state, {company})=>({...state, currentCompany: company, loading: false})),
    on(CompanyAction.loadCompanyFailure, (state, {error})=> ({...state, error, loading: false})),
    on(CompanyAction.loadNearbyCompanies, state =>({...state, loading: true})),
    on(CompanyAction.loadNearbyCompaniesSuccess, (state, {companies})=>({...state, nearbyCompanies: companies, loading: false})),
    on(CompanyAction.loadNearbyCompaniesFailure,(state, {error})=> ({...state, error, loading: false}))
)

