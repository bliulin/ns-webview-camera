import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { AccountsStateService } from '../../services/accounts-state.service';
import { AccountDetailsOutputModel } from '../../models/api/accountDetailsOutputModel';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { Observable, merge, combineLatest } from 'rxjs';
import * as appSettings from 'tns-core-modules/application-settings';
import { tap } from 'rxjs/internal/operators/tap';
import { EWallet } from '~/app/shared/constants';
import { AccountDetailsService } from './account-details.service';
import { CardType } from '../../models/api';
import { EWalletStateService } from '~/app/e-wallet/services/e-wallet-state.service';
import { map } from 'rxjs/operators';

@Component({
    templateUrl: './account-details.component.html',
    styleUrls: ['./account-details.component.scss'],
    providers: [AccountDetailsService]
})
export class AccountDetailsComponent extends BaseComponent implements OnInit {
    public account$: Observable<AccountDetailsOutputModel>;
    private account: AccountDetailsOutputModel;
    constructor(
        page: Page,
        routerExt: RouterExtensions,
        private containerRef: ViewContainerRef,
        private service: AccountsStateService,
        private eWalletStateService: EWalletStateService,
        private controllerService: AccountDetailsService
    ) {
        super(routerExt);
        page.actionBarHidden = true;
    }

    public get showEmitCardBox(): boolean {
        return this.account.eligibleCards.length > 0;
    }

    public ngOnInit(): void {
        this.account$ = combineLatest([this.service.currentAccountDetails$, this.service.newAccountDetails$]).pipe(
            map(([existingAccountDetails, newCreatedAccountDetails]) =>
                !!newCreatedAccountDetails ? newCreatedAccountDetails : existingAccountDetails
            ),
            tap((accountDetailsToShow) => (this.account = accountDetailsToShow))
        );
    }

    public onShowCardSelectionButtonTap(): void {
        this.controllerService
            .showCardSelectionModal(this.account.eligibleCards, this.containerRef)
            .subscribe((response) => {
                if (response) {
                    const userChoice = response.result;
                    switch (userChoice) {
                        case CardType.Virtual:
                            this.eWalletStateService.selectedEligibleCardSubject.next(response.resultId);
                            this.redirectToCardCreationFlow(`e-wallet/card/name`, this.account.id);
                            break;
                        case CardType.Physical:
                            this.eWalletStateService.selectedEligibleCardSubject.next(response.resultId);
                            this.redirectToCardCreationFlow(`e-wallet/card/pin/set`, this.account.id);
                            break;
                        default:
                            break;
                    }
                }
            });
    }

    public onCardDetailsButtonTap(cardId: string): void {
        appSettings.setString(EWallet.CurrentCardId, cardId);
        super.navigateToDashboard('e-wallet', 'fade', false);
    }

    public onCloseTap(): void {
        this.onOkButtonTap();
    }

    public onOkButtonTap(): void {
        if (this.routerExtensions.canGoBackToPreviousPage()) {
            super.goBack();
        } else {
            super.navigateToDashboard('accounts', 'slideRight', false);
        }
    }

    public onStatementButtonTap(): void {
        super.redirectTo('accounts/statement');
    }

    private redirectToCardCreationFlow(path: string, id: string): void {
        this.routerExtensions.navigate([path], {
            queryParams: { accountId: id },
            transition: {
                name: 'fade'
            }
        });
    }
}
