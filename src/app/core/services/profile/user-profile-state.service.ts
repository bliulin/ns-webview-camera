import { Injectable } from '@angular/core';
import { UserProfileApiService } from './user-profile-api.service';
import {
    NUIDValidationStatus,
    UserCustomerMappingOutputModel,
    UserProfileOutputModel
} from '../../models/user-profile';
import { BehaviorSubject, combineLatest, Observable, zip } from 'rxjs';
import { map, mapTo, tap } from 'rxjs/operators';

import * as appSettings from 'tns-core-modules/application-settings';
import { CachedObservable } from '../cached-observable';
import { Profile } from '~/app/shared/constants';
import { User } from '../../models/user.model';
import { traceDebug } from '~/app/core/logging/logging-utils';

@Injectable({ providedIn: 'root' })
export class UserProfileStateService {
    public userProfile$: CachedObservable<UserProfileOutputModel>;

    public user$: Observable<User>;
    public companies$: Observable<UserCustomerMappingOutputModel[]>;

    public currentCompany$: Observable<UserCustomerMappingOutputModel>;
    public selectedCompany$: Observable<UserCustomerMappingOutputModel>;

    constructor(private profileApiService: UserProfileApiService) {
        this.initObservables();
    }

    public currentCustomerSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private currentCustomerAction$: Observable<string> = this.currentCustomerSubject.asObservable();

    public companySelectedSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private companySelectedAction$: Observable<string> = this.companySelectedSubject.asObservable();

    public invalidateCache(): void {
        this.userProfile$.invalidate();
    }

    public reload(): void {
        this.userProfile$.reload();
    }

    public isMappedAndHasNuidValid(company: UserCustomerMappingOutputModel): boolean {
        return company.mappingEnabled && company.customer.nuidValidationStatus === NUIDValidationStatus.Valid;
    }

    public setCurrentCustomer(currentCustomerId: string): void {
        traceDebug('Setting current customer ID to ' + currentCustomerId);
        appSettings.setString(Profile.CurrentCustomerId, currentCustomerId);
        this.currentCustomerSubject.next(currentCustomerId);
    }

    /**
     * CALL ONLY ONCE AFTER AUTH
     * Triggers all the observables in user profile. Sets CustomerId needed for all the other calls.
     */
    public loadUserProfile(): Observable<boolean> {
        traceDebug('[UserProfileService] Loading user profile');
        this.initObservables();
        return zip(this.user$, this.companies$).pipe(mapTo(true));
    }

    private initObservables(): void {
        this.userProfile$ = new CachedObservable(this.profileApiService.get());

        this.extractUser();

        this.extractCompanies();

        this.setCurrentCompany();

        this.initiateCompanySelection();
    }

    private extractUser(): void {
        this.user$ = this.userProfile$.pipe(map(userProfile => ({ ...userProfile } as User)));
    }

    private extractCompanies(): void {
        this.companies$ = this.userProfile$.pipe(
            tap(this.handleCurrentCompanySet()),
            map(userProfile => userProfile.customerMappings)
        );
    }

    private setCurrentCompany(): void {
        this.currentCompany$ = combineLatest([this.companies$, this.currentCustomerAction$]).pipe(
            map(([companies, selectedCustomerId]) =>
                companies.find(
                    company =>
                        company.customer.customerId === selectedCustomerId && this.isMappedAndHasNuidValid(company)
                )
            )
        );
    }

    private initiateCompanySelection(): void {
        this.selectedCompany$ = combineLatest([this.companies$, this.companySelectedAction$]).pipe(
            map(([companies, selectedCompanyId]) =>
                companies.find(company => company.customer.customerId === selectedCompanyId)
            )
        );
    }

    private handleCurrentCompanySet(): (x: UserProfileOutputModel) => void {
        return userProfile => {
            const currentCustomerIdIsSet = appSettings.hasKey(Profile.CurrentCustomerId);

            const currentCustomerId = appSettings.getString(Profile.CurrentCustomerId);

            const companies = userProfile.customerMappings;

            const mappedAndValidCompanies = companies.filter(company => this.isMappedAndHasNuidValid(company));

            const currentCustomerIdIsStillValid =
                mappedAndValidCompanies.find(company => company.customer.customerId === currentCustomerId) || null;

            if (currentCustomerIdIsSet && currentCustomerIdIsStillValid) {
                this.setCurrentCustomer(currentCustomerId);
            } else {
                if (mappedAndValidCompanies.length > 0) {
                    const firstCustomerId = mappedAndValidCompanies[0].customer.customerId;
                    this.setCurrentCustomer(firstCustomerId);
                }
            }
        };
    }
}
