import { Injectable } from '@angular/core';
import { CachedObservable } from '~/app/core/services/cached-observable';
import { TransfersApiService } from './transfers-api.service';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { AccountsStateService } from '~/app/accounts/services/accounts-state.service';
import { Account } from '~/app/accounts/models/api';
import {
    PartnerOutputModel,
    AssociatedAccount,
    AddedPaymentOutputModel,
    ConfirmedPaymentOutputModel,
    PaymentModel
} from '../models/api';
import { map, tap } from 'rxjs/operators';
import { AddedTransferOutputModel } from '~/app/transfers/models/api/addedTransferOutputModel';
import { TransferModel } from '~/app/transfers/models/api/transferModel';
import { TransactionInfoModel } from '~/app/transfers/models/api/transactionInfoModel';
import { ConfirmedTransferOutputModel } from '~/app/transfers/models/api/confirmedTransferOutputModel';
import { traceDebug } from "~/app/core/logging/logging-utils";

@Injectable({ providedIn: 'root' })
export class TransfersStateService {
    private _partnersVM$: CachedObservable<PartnerOutputModel[]>;
    private _partners$: Observable<PartnerOutputModel[]>;

    private _selectedPartner$: Observable<PartnerOutputModel>;

    private _accounts$: Observable<Account[]>;

    public partnerInsertedSubject: BehaviorSubject<PartnerOutputModel> = new BehaviorSubject<PartnerOutputModel>(null);
    private partnerInsertedAction$: Observable<PartnerOutputModel> = this.partnerInsertedSubject.asObservable();

    public partnerSelectedSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private partnerSelectedAction$: Observable<string> = this.partnerSelectedSubject.asObservable();

    private partnerSelectedAccountSubject$: BehaviorSubject<AssociatedAccount> = new BehaviorSubject(null);

    private createdTransferSubject$: BehaviorSubject<AddedTransferOutputModel> = new BehaviorSubject(null);
    private confirmedTransferSubject$: BehaviorSubject<ConfirmedTransferOutputModel> = new BehaviorSubject(null);

    private createdPaymentSubject$: BehaviorSubject<AddedPaymentOutputModel> = new BehaviorSubject(null);
    private confirmedPaymentSubject$: BehaviorSubject<ConfirmedPaymentOutputModel> = new BehaviorSubject(null);

    constructor(private apiService: TransfersApiService, private accountsStateService: AccountsStateService) {
        this.initObservables();
    }

    public get partnerSelectedAccount$(): Observable<AssociatedAccount> {
        return this.partnerSelectedAccountSubject$.asObservable();
    }

    public setPartnerSelectedAccount(account: AssociatedAccount): void {
        this.partnerSelectedAccountSubject$.next(account);
    }

    public get partnersVM$(): Observable<any> {
        return this._partnersVM$;
    }

    public get partners$(): Observable<any> {
        return this._partners$;
    }

    public get accounts$(): Observable<Account[]> {
        return this._accounts$;
    }

    public get seletedPartner$(): Observable<PartnerOutputModel> {
        return this._selectedPartner$;
    }

    public get addedTransfer$(): Observable<AddedTransferOutputModel> {
        return this.createdTransferSubject$.asObservable();
    }

    public get confirmedTransfer$(): Observable<ConfirmedTransferOutputModel> {
        return this.confirmedTransferSubject$.asObservable();
    }

    public get addedPayment$(): Observable<AddedPaymentOutputModel> {
        return this.createdPaymentSubject$.asObservable();
    }

    public invalidateCache(): void {
        this._partnersVM$.invalidate();
        this.accountsStateService.invalidateCache();
    }

    public addTransfer(transferModel: TransferModel): Observable<AddedTransferOutputModel> {
        return this.apiService
            .addTransfer(transferModel)
            .pipe(tap((result) => this.createdTransferSubject$.next(result)));
    }

    public confirmTransfer(model: TransactionInfoModel): Observable<ConfirmedTransferOutputModel> {
        return this.apiService
            .confirmTransfer(model)
            .pipe(tap((result) => this.confirmedTransferSubject$.next(result)));
    }

    public addPayment(paymentModel: PaymentModel): Observable<AddedPaymentOutputModel> {
        traceDebug('Add payment POST data: ' + JSON.stringify(paymentModel));
        return this.apiService.addPayment(paymentModel).pipe(tap((result) => this.createdPaymentSubject$.next(result)));
    }

    public confirmPayment(model: TransactionInfoModel): Observable<ConfirmedPaymentOutputModel> {
        return this.apiService.confirmPayment(model).pipe(tap((result) => this.confirmedPaymentSubject$.next(result)));
    }

    private initObservables(): void {
        const partnersReq = this.apiService.get().pipe(tap(() => this.partnerInsertedSubject.next(null)));
        this._partnersVM$ = new CachedObservable(partnersReq);

        this._accounts$ = this.accountsStateService.accounts$;

        this._partners$ = combineLatest([this._partnersVM$, this.partnerInsertedAction$]).pipe(
            map(([existingPartners, newPartner]) =>
                !!newPartner ? [...existingPartners, newPartner] : existingPartners
            )
        );

        this._selectedPartner$ = combineLatest([this._partners$, this.partnerSelectedAction$]).pipe(
            map(([partners, selectedPartnerId]) => partners.find((partner) => partner.id === selectedPartnerId))
        );
    }
}
