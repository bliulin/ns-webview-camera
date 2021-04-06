import { Component, ViewChild } from '@angular/core';
import { BaseComponent } from '~/app/shared/base.component';
import { GenericPinComponent } from '~/app/shared/components';
import { RouterExtensions } from 'nativescript-angular';
import { Page } from 'tns-core-modules/ui/page/page';
import { PinStateService } from '~/app/shared/services/pin-state.service';
import { EWalletStateService } from '~/app/e-wallet/services/e-wallet-state.service';
import { EWalletApiService } from '~/app/e-wallet/services/e-wallet-api.service';
import { CardPinModel } from '~/app/e-wallet/models/api';
import { take } from 'rxjs/operators';
import { NotificationBannerService } from '~/app/shared/services';
import localize from 'nativescript-localize';

@Component({
    selector: 'omro-cxonfirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss']
})
export class ConfirmChangeCardPinComponent extends BaseComponent {
    @ViewChild('genericPin', { static: false })
    public genericPinComponent: GenericPinComponent;

    private backButtonDisabled: boolean = false;

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private pinStateService: PinStateService,
        private stateService: EWalletStateService,
        private apiService: EWalletApiService,
        private notificationBannerService: NotificationBannerService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public goBack(): void {
        if (!this.backButtonDisabled) {
            this.pinStateService.resetFormForPreviousStep();
            super.goBack();
        }
    }

    public validatePIN(actualIntroducedPin: string): void {
        if (this.pinStateService.pinIntroducedInThePreviousStep !== actualIntroducedPin) {
            this.handleNoMatch();
        } else {
            this.handleMatch(actualIntroducedPin);
        }
    }

    private handleMatch(newPin: string): void {
        this.backButtonDisabled = true;
        this.genericPinComponent.pin.validInput = true;
        const cardId = this.stateService.selectedCardId;
        this.apiService
            .changeCardPin(<CardPinModel>{
                cardId: cardId,
                pin: newPin
            })
            .pipe(take(1))
            .subscribe(
                (success) => {
                    super.dismissSoftKeyboard();
                    this.notificationBannerService.showSuccess(
                        localize('Common.GenericSuccessMessage.title'),
                        localize('EWallet.Configuration.ChangePin.ChangeCardPinSuccessMessage'),
                        1800
                    );
                    setTimeout(() => this.navigateToDashboard('e-wallet', 'slideRight', false), 2000);
                },
                (error) => this.notificationBannerService.showGenericError()
            );
    }

    private handleNoMatch(): void {
        this.genericPinComponent.pin.validInput = false;
        this.genericPinComponent.pin.resetForm();
        this.genericPinComponent.pin.shake();
    }
}
