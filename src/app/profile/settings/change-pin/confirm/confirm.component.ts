import { Component, ViewChild, NgZone } from '@angular/core';

import { RouterExtensions } from 'nativescript-angular/router';
import { Location } from '@angular/common';
import { Authentication } from '~/app/shared/constants';
import { KeystoreService } from '~/app/core/services/keystore.service';
import { Page } from 'tns-core-modules/ui/page/page';
import { PinStateService } from '~/app/shared/services/pin-state.service';
import { GenericPinComponent } from '~/app/shared/components/generic-pin/generic-pin.component';
import { BaseComponent } from '~/app/shared/base.component';

@Component({
    selector: 'omro-confirm-changed-pin',
    templateUrl: './confirm.component.html'
})
export class ConfirmNewPinComponent extends BaseComponent {
    @ViewChild('genericPin', { static: false })
    public genericPinComponent: GenericPinComponent;
    public backButtonDisabled: boolean = false;

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private location: Location,
        private pinStateService: PinStateService,
        private keyStore: KeystoreService,
        private ngZone: NgZone
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    private set PIN(pin: string) {
        this.keyStore.set(Authentication.Pin, pin);
    }

    public goBack(): void {
        if (!this.backButtonDisabled) {
            this.pinStateService.resetFormForPreviousStep();
            this.location.back();
        }
    }

    public validatePIN(actualIntroducedPin: string): void {
        if (this.pinStateService.pinIntroducedInThePreviousStep !== actualIntroducedPin) {
            this.handleNoMatch();
        } else {
            this.handleMatch(actualIntroducedPin);
        }
    }

    public goToProfilePage(): void {
        this.ngZone.run(() => {
            this.routerExtensions.navigate(['/dashboard', { outlets: { dashboard: ['profile'] } }], {
                transition: { name: 'slideRight' }
            });
        });
    }

    private handleMatch(actualIntroducedPin: string): void {
        super.dismissSoftKeyboard();
        this.backButtonDisabled = true;
        this.genericPinComponent.pin.validInput = true;
        this.PIN = actualIntroducedPin;

        setTimeout(() => this.goToProfilePage(), 2000);
    }

    private handleNoMatch(): void {
        this.genericPinComponent.pin.validInput = false;
        this.genericPinComponent.pin.resetForm();
        this.genericPinComponent.pin.shake();
    }
}
