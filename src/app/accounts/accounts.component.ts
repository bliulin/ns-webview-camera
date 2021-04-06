import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AccountsService, AccountsUiState } from './accounts.service';
import { AccountsStateService } from './services/accounts-state.service';
import { Account, EligibleCurrency, Transaction } from './models/api';
import { Observable, throwError, combineLatest } from 'rxjs';
import { catchError, retryWhen, map, tap } from 'rxjs/operators';
import { NotificationBannerService } from '../shared/services';
import { BaseComponent } from '../shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { ApplicationService } from '../core/services/application.service';
import { Page } from 'tns-core-modules/ui/page/page';

interface AccountsVm {
    uiState: AccountsUiState;
    accounts: Account[];
    currentAccount: Account;
    eligibleCurrencies: EligibleCurrency;
}

@Component({
    selector: 'omro-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.scss'],
    providers: [AccountsService]
})
export class AccountsComponent extends BaseComponent implements OnInit {
    public vm$: Observable<AccountsVm>;
    public transactions$: Observable<Transaction[]>;

    constructor(
        routerExtensions: RouterExtensions,
        application: ApplicationService,
        private page: Page,
        private containerRef: ViewContainerRef,
        private controllerService: AccountsService,
        private stateService: AccountsStateService,
        private notificationService: NotificationBannerService
    ) {
        super(routerExtensions, application);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.stateService.invalidateCache();

        this.vm$ = combineLatest([
            this.stateService.accountsVM$
                .pipe(catchError((err) => this.handleError(err)))
                .pipe(retryWhen(this.getNoConnectivityRetryStrategy()))
                .pipe(map(this.controllerService.getState)),
            this.stateService.accounts$,
            this.stateService.currentAccount$,
            this.stateService.eligibleCurrencies$
        ]).pipe(
            map(([uiState, accounts, currentAccount, eligibleCurrencies]) => ({
                uiState,
                accounts,
                currentAccount,
                eligibleCurrencies
            }))
        );

        this.transactions$ = this.stateService.currentAccountTransactions$;
    }

    public onShowCardSelectionButtonTap(): void {
        super.redirectTo('accounts/create-account');
    }

    public onSwitchButtonTap(): void {
        this.controllerService.showSwitchCardBottomSheet(this.containerRef);
    }

    public onTransactionTapped(transactionId: string): void {
        super.redirectTo(`accounts/transaction/${transactionId}/details`, false, 'fade');
    }

    private handleError(err: any): Observable<never> {
        this.notificationService.showGenericError(err);
        return throwError(err);
    }
}
