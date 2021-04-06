import { UIOutputModel } from '../models/uIOutputModel';
import { Observable, throwError, BehaviorSubject, combineLatest } from 'rxjs';
import { CachedObservable } from '~/app/core/services/cached-observable';
import { APP_CONFIG } from '~/app/core/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, filter, timeout } from 'rxjs/internal/operators';
import { CreditRequestService } from '~/app/credit-request/services/credit-request.service';
import { tap } from 'rxjs/internal/operators/tap';
import { traceDebug, traceError } from '~/app/core/logging/logging-utils';
import { ProductType } from '~/app/credit-request/models/types';
import { EligibleProductOutputModel } from '~/app/credit-request/models/eligibleProductOutputModel';
import { DashboardModule } from '../models/dashboardModule';
import { DashboardModuleType } from '../models/dashboardModuleType';
import { LoansModuleLoan } from '../models/loansModuleLoan';
import * as appSettings from 'tns-core-modules/application-settings';
import { Loans, AppEvents, ProductRequestEvents } from '~/app/shared/constants';
import { LoansModuleActivityItem } from '../models/loansModuleActivityItem';
import { MessagingService } from '~/app/core/services/messaging.service';
import { Injectable } from '@angular/core';
import { merge } from 'rxjs/internal/observable/merge';

@Injectable({
    providedIn: 'root'
})
export class UiService {
    private _ui$: CachedObservable<UIOutputModel>;
    private _eligibleStandardProduct$: Observable<EligibleProductOutputModel>;
    private _loansModule$: Observable<DashboardModule>;

    private _loans$: Observable<LoansModuleLoan[]>;
    private _activities$: Observable<any>;
    private _currentLoan$: Observable<LoansModuleLoan>;
    private _currentActivitiesList$: Observable<LoansModuleActivityItem[]>;

    private currentLoanIdSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    constructor(
        private httpClient: HttpClient,
        private creditRequestService: CreditRequestService,
        private messagingService: MessagingService
    ) {
        this.initObservables();
    }

    private initObservables() {
        const uiReq = this.getUi();

        this._ui$ = new CachedObservable(uiReq);

        this._eligibleStandardProduct$ = this.ui$.pipe(
            map(ui => ui.eligibleProducts.find(p => p.productType === ProductType.Filbo))
        );

        this._loansModule$ = this.ui$.pipe(
            map(ui =>
                ui.dashboardModules.find(
                    dashboardModule => dashboardModule.moduleType === DashboardModuleType.LoansModule
                )
            )
        );

        this._loans$ = this._loansModule$.pipe(
            filter(loansModule => Boolean(loansModule)),
            tap(loansModule => {
                const currentLoanId = loansModule.loans[0].loanId;
                if (!appSettings.hasKey(Loans.CurrentLoanId)) {
                    this.setCurrentLoan(currentLoanId);
                } else {
                    this.currentLoanIdSubject.next(appSettings.getString(Loans.CurrentLoanId));
                }
            }),
            map(loansModule => loansModule.loans)
        );

        this._activities$ = this._loansModule$.pipe(map(loansModule => loansModule.loansActivity));

        this._currentLoan$ = combineLatest([this._loans$, this.currentLoanIdSubject.asObservable()]).pipe(
            map(([loans, selectedLoanId]) => loans.find(loan => loan.loanId === selectedLoanId))
        );

        this._currentActivitiesList$ = combineLatest([
            this._activities$,
            this.currentLoanIdSubject.asObservable()
        ]).pipe(map(([activities, selectedLoanId]) => activities[selectedLoanId]));

        merge(this.messagingService.getEvent(ProductRequestEvents.InitiateProductRequestCompleted))
            .subscribe(() => this.reload());
    }

    public get ui$(): Observable<UIOutputModel> {
        return this._ui$;
    }

    public get eligibleStandardProduct$(): Observable<EligibleProductOutputModel> {
        return this._eligibleStandardProduct$;
    }

    public get loans$(): Observable<LoansModuleLoan[]> {
        return this._loans$;
    }

    public get currentLoan$(): Observable<LoansModuleLoan> {
        return this._currentLoan$;
    }

    public get currentActivitiesList$(): Observable<any> {
        return this._currentActivitiesList$;
    }

    public setCurrentLoan(loanId: string): void {
        appSettings.setString(Loans.CurrentLoanId, loanId);
        this.currentLoanIdSubject.next(loanId);
    }

    public reload(): void {
        traceDebug('[UIService] Reload');
        this._ui$.reload();
    }

    public invalidateCache(): void {
        traceDebug('[UIService] Invalidate cache');
        this._ui$.invalidate();
    }

    private setCurrentProductRequest(ui: UIOutputModel): void {
        if (!ui.requestsInProgress || ui.requestsInProgress.length === 0) {
            return;
        }

        const currentProductRequestId = this.creditRequestService.currentProductRequestId;
        if (
            !currentProductRequestId ||
            !ui.requestsInProgress.find(r => r.productRequestId === currentProductRequestId)
        ) {
            traceDebug('[UIService] Setting new current product request');
            this.creditRequestService.currentProductRequestId = ui.requestsInProgress[0].productRequestId;
        }
    }

    private getUi(): Observable<UIOutputModel> {
        return this.httpClient
            .get<UIOutputModel>(`${APP_CONFIG.baseUrl}Private/ui`)
            .pipe(
                tap(ui => {
                    traceDebug('[UIService] UI changed');
                    this.setCurrentProductRequest(ui);
                })
            );
    }
}
