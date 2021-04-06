import { Component, ViewChild } from '@angular/core';
import { GenericPinComponent } from '~/app/shared/components';
import { PinStateService } from '~/app/shared/services/pin-state.service';
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular';
import { BaseComponent } from '~/app/shared/base.component';
import { CreateCardService } from '../../create-card.service';

@Component({
    selector: 'omro-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss']
})
export class ConfirmCardPinComponent extends BaseComponent {
    @ViewChild('genericPin', { static: false })
    public genericPinComponent: GenericPinComponent;

    private backButtonDisabled: boolean = false;

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private pinStateService: PinStateService,
        private cardCreationService: CreateCardService
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
            this.cardCreationService.setPin(actualIntroducedPin);
            this.handleMatch();
        }
    }

    private handleMatch(): void {
        super.dismissSoftKeyboard();
        this.backButtonDisabled = true;
        this.genericPinComponent.pin.validInput = true;
        setTimeout(() => this.redirectTo('/e-wallet/card/delivery', true), 2000);
    }

    private handleNoMatch(): void {
        this.genericPinComponent.pin.validInput = false;
        this.genericPinComponent.pin.resetForm();
        this.genericPinComponent.pin.shake();
    }
}
