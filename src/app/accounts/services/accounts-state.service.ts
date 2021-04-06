import { Injectable } from '@angular/core';
import { AccountsApiService } from './accounts-api.service';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { Account, AccountsOutputModel, EligibleCurrency, AccountDetailsOutputModel, Transaction } from '../models/api';
import { CachedObservable } from '~/app/core/services/cached-observable';
import { map, switchMap, tap, filter, shareReplay } from 'rxjs/operators';
import { AppSettingsService } from '~/app/core/services/app-settings.service';
import { Accounts, Profile } from '~/app/shared/constants';
import { MessagingService } from "~/app/core/services/messaging.service";

@Injectable({
    providedIn: 'root'
})
export class AccountsStateService {
    private init: boolean = true;
    private initialSelectedCustomerId: string;
    private _accountsVM$: CachedObservable<AccountsOutputModel>;

    private _accounts$: Observable<Account[]>;
    private _currentAccount$: Observable<Account>;
    private _currentAccountTransactions$: Observable<Transaction[]>;

    public newAccountDetails$: BehaviorSubject<AccountDetailsOutputModel> = new BehaviorSubject<
        AccountDetailsOutputModel
    >(null);

    private _eligibleCurrenciesVm$: Observable<EligibleCurrency>;

    public currentAccountIdSubject: BehaviorSubject<string> = new BehaviorSubject(null);
    private _currentAccountDetails$: CachedObservable<AccountDetailsOutputModel>;

    private createdTransaction$: BehaviorSubject<Transaction> = new BehaviorSubject(null);

    constructor(private apiService: AccountsApiService, private appSettings: AppSettingsService,
                private messagingService: MessagingService) {
        this.initialSelectedCustomerId = this.actualCustomerId;
        this.initObservables();

        this.messagingService.getEvent<Transaction>("TransactionCreated")
            .subscribe(transaction => this.createdTransaction$.next(transaction));
    }

    public get accountsVM$(): Observable<AccountsOutputModel> {
        return this._accountsVM$;
    }

    public get accounts$(): Observable<Account[]> {
        return this._accounts$;
    }

    public get currentAccount$(): Observable<Account> {
        return this._currentAccount$;
    }

    public get eligibleCurrencies$(): Observable<EligibleCurrency> {
        return this._eligibleCurrenciesVm$;
    }

    public get currentAccountDetails$(): Observable<AccountDetailsOutputModel> {
        return this._currentAccountDetails$;
    }

    public get currentAccountTransactions$(): Observable<Transaction[]> {
        return this._currentAccountTransactions$;
    }

    public reload(): void {
        this.init = true;
        this._accountsVM$.reload();
    }

    public invalidateCache(): void {
        if (this.customerIdHasChanged) {
            this.init = true;
        }
        this._accountsVM$.invalidate();
        this._currentAccountDetails$.invalidate();
    }

    public selectAccountWithId(id: string): void {
        this.currentAccountIdSubject.next(id);
        this.appSettings.set(Accounts.CurrentAccountId, id);
    }

    private get actualCustomerId(): string {
        return this.appSettings.getString(Profile.CurrentCustomerId);
    }

    private initObservables(): void {
        const accountsReq = this.apiService.get().pipe(tap(() => this.newAccountDetails$.next(null)));
        this._accountsVM$ = new CachedObservable(accountsReq);

        this._accounts$ = this._accountsVM$.pipe(
            map((accountsVm) => accountsVm.accounts),
            tap((accounts) => this.handleCurrentAccount(accounts))
        );

        this._currentAccount$ = combineLatest([this._accounts$, this.currentAccountIdSubject]).pipe(
            map(([accounts, selectedAccountId]) => accounts.find((account) => account.id === selectedAccountId))
        );

        this._eligibleCurrenciesVm$ = this._accountsVM$.pipe(map((accountsVm) => accountsVm.eligibleCurrencies));

        const accountDetailsReq = this.currentAccountIdSubject.pipe(
            filter((id) => Boolean(id)),
            switchMap((id) => this.apiService.getAccountDetails(id))
        );
        this._currentAccountDetails$ = new CachedObservable(accountDetailsReq);

        this._currentAccountTransactions$ = this._currentAccountDetails$.pipe(
            map((currentAccountDetails) => currentAccountDetails.transactions)
        );

        this._currentAccountTransactions$ = combineLatest([this._currentAccountDetails$, this.createdTransaction$])
            .pipe(map(([currentAccountDetails, transaction]) => {
                const accountTransactions = currentAccountDetails.transactions;
                if (transaction && !accountTransactions.find(t => t.transactionId === transaction.transactionId)) {
                    accountTransactions.push(transaction);
                }
                return accountTransactions;
            }));
    }

    private customerIdHasChanged(): boolean {
        return this.initialSelectedCustomerId === this.actualCustomerId;
    }

    private handleCurrentAccount(accounts: Account[]): void {
        if (accounts.length < 1) {
            return;
        }
        const currentAccountId = this.appSettings.getString(Accounts.CurrentAccountId);
        const currentAccountIdIsStillValid = accounts.find((account) => account.id === currentAccountId) || null;
        const isTheSameSelectedAccount = !this.init && currentAccountId === this.currentAccountIdSubject.getValue();
        if (this.init) {
            this.init = false;
        }

        if (!isTheSameSelectedAccount) {
            if (currentAccountId && currentAccountIdIsStillValid) {
                this.currentAccountIdSubject.next(currentAccountId);
            } else {
                this.selectAccountWithId(accounts[0].id);
            }
        }
    }
}
