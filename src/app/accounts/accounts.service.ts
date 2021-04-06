import { Injectable, ViewContainerRef } from '@angular/core';
import { AccountsOutputModel, Account } from './models/api';
import { Observable, combineLatest } from 'rxjs';
import { BottomDialogButton, BottomDialogButtonType, Orientation } from '../shared/models/bottom-dialog.config';
import { CardType } from '../e-wallet/models/api';
import localize from 'nativescript-localize';
import { AccountsStateService } from './services/accounts-state.service';
import { OmroModalService } from '../shared/services/omro-modal.service';
import { BottomSheetOptions } from 'nativescript-material-bottomsheet/angular';
import { SwitchCurrentAccountComponent } from './components';
import { map } from 'rxjs/operators';
import { AccountSelectionModel } from './models';

export interface AccountsUiState {
    hasAccount: boolean;
    isEligibleForAccount: boolean;
    hasTransactions: boolean;
}

@Injectable()
export class AccountsService {
    constructor(private stateService: AccountsStateService, private omroModalService: OmroModalService) {}

    public getState(accountsVm: AccountsOutputModel): AccountsUiState {
        return <AccountsUiState>{
            hasAccount: accountsVm.accounts.length > 0,
            isEligibleForAccount: !!accountsVm.eligibleCurrencies.currencyCodes
        };
    }

    public showSwitchCardBottomSheet(containerRef: ViewContainerRef): void {
        const options: BottomSheetOptions = {
            viewContainerRef: containerRef,
            context: this.getAccountsMappedToAccountSelectionModel$(),
            transparent: true
        };

        this.omroModalService.showBottomSheet(SwitchCurrentAccountComponent, options);
    }

    public getAccountsMappedToAccountSelectionModel$(): Observable<any> {
        return combineLatest([this.stateService.accounts$, this.stateService.currentAccountIdSubject]).pipe(
            map(([accounts, currentSelectedAccount]) =>
            accounts.map(
                    (account) =>
                        ({
                           id: account.id,
                           workingBalance: account.workingBalance,
                           currencyCode: account.currencyCode,
                           color: account.color,
                           isSelected: account.id === currentSelectedAccount ? true : false
                        } as AccountSelectionModel)
                )
            )
        );
    }
}
