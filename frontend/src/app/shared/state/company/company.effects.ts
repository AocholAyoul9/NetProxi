import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { ApiService } from "../../../core/api.service";
import * as CompanyActions from './company.actions';


@Injectable()
export class CompanyEffects{
    constructor(private actions$: Actions, private api: ApiService){}

    loadCompany$ = createEffect(()=>
    this.actions$.pipe(
        ofType(CompanyActions.loadCompany),
        mergeMap(({id})=>
        this.api.getCompanyById(id).pipe(
            map(company => CompanyActions.loadCompanySuccess({company})),
            catchError(error =>of(CompanyActions.loadCompanyFailure({error})))
        ))
    ));

    loadNearbyCompanies$ = createEffect(()=>
    this.actions$.pipe(
        ofType(CompanyActions.loadNearbyCompanies),
        mergeMap(({lat, lng, radiusKm})=>
        this.api.getNearByCompanies(lat, lng, radiusKm).pipe(
            map(companies => CompanyActions.loadNearbyCompaniesSuccess({companies})),
            catchError(error =>of(CompanyActions.loadNearbyCompaniesFailure({error})))
        ))
    ))
}