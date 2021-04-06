import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { EWalletStateService } from './services/e-wallet-state.service';
import { Observable, throwError } from 'rxjs';
import { CardOutputModel, Card, EligibleCard, CardType } from './models/api';
import { catchError, retryWhen, map } from 'rxjs/operators';
import { NotificationBannerService } from '../shared/services';
import { ApplicationService } from '~/app/core/services/application.service';
import { EWalletService, EWalletUiState } from './e-wallet.service';
import { CardViewModel } from "~/app/e-wallet/models/card-view-model";

@Component({
    selector: 'omro-e-wallet',
    templateUrl: './e-wallet.component.html',
    styleUrls: ['./e-wallet.component.scss'],
    providers: [EWalletService]
})
export class EWalletComponent extends BaseComponent implements OnInit {
    public eWalletVm$: Observable<CardOutputModel>;
    public cards$: Observable<Card[]>;
    public eligibleCards$: Observable<EligibleCard[]>;
    public selectedCard$: Observable<CardViewModel>;

    public state$: Observable<EWalletUiState>;

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private containerRef: ViewContainerRef,
        private stateService: EWalletStateService,
        private notificationService: NotificationBannerService,
        private controllerService: EWalletService,
        application: ApplicationService
    ) {
        super(routerExtensions, application);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.stateService.invalidateCache();

        this.eWalletVm$ = this.stateService.eWalletVm$
            .pipe(catchError((err) => this.handleError(err)))
            .pipe(retryWhen(this.getNoConnectivityRetryStrategy()));
        this.cards$ = this.stateService.cards$;
        this.eligibleCards$ = this.stateService.eligibleCards$;
        this.selectedCard$ = this.stateService.currentSelectedCard$;

        this.state$ = this.eWalletVm$.pipe(map(this.controllerService.getState));
    }

    public onSwitchCardTap(): void {
        this.controllerService.showSwitchCardBottomSheet(this.containerRef);
    }

    public onShowCardSelectionButtonTap(eligibleCards: EligibleCard[]): void {
        this.controllerService.showCardSelectionModal(eligibleCards, this.containerRef).subscribe((response) => {
            if (response) {
                const userChoice = response.result;
                switch (userChoice) {
                    case CardType.Virtual:
                        this.stateService.selectedEligibleCardSubject.next(response.resultId);
                        this.redirectTo(`e-wallet/card/name`);
                        break;
                    case CardType.Physical:
                        this.stateService.selectedEligibleCardSubject.next(response.resultId);
                        this.redirectTo(`e-wallet/card/pin/set`);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    public isConfigurationAvaible(state: EWalletUiState, selectedCard: CardViewModel): boolean {
        if (!(state.onlyIssuedCards || state.bothAvailable)) {
            return false;
        }
        return selectedCard.uiState.showConfigSection;
    }

    private handleError(err: any): Observable<never> {
        this.notificationService.showGenericError(err);
        return throwError(err);
    }
}
