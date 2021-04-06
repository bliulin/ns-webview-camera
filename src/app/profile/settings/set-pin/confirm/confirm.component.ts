import { Component, ViewChild } from '@angular/core';

import { RouterExtensions } from 'nativescript-angular/router';
import { Location } from '@angular/common';
import * as appSettings from 'tns-core-modules/application-settings';
import { Authentication } from '~/app/shared/constants';
import { KeystoreService } from '~/app/core/services/keystore.service';
import { Page } from 'tns-core-modules/ui/page/page';
import { PinStateService } from '~/app/shared/services/pin-state.service';
import { GenericPinComponent } from '~/app/shared/components/generic-pin/generic-pin.component';
import { AuthorizationService } from '~/app/unlock/authorization.service';
import { BaseComponent } from '~/app/shared/base.component';

@Component({
    selector: 'omro-confirm-pin',
    templateUrl: './confirm.component.html'
})
export class ConfirmPinComponent extends BaseComponent {
    @ViewChild('genericPin', { static: false })
    public genericPinComponent: GenericPinComponent;

    private backButtonDisabled: boolean = false;

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private location: Location,
        private authorizationService: AuthorizationService,
        private pinStateService: PinStateService,
        private keyStore: KeystoreService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    private set PIN(pin: string) {
        this.keyStore.set(Authentication.Pin, pin);
    }

    private set passCodeEnabled(value: boolean) {
        appSettings.setBoolean(Authentication.PassCodeEnabled, value);
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

    private handleMatch(actualIntroducedPin: string): void {
        super.dismissSoftKeyboard();
        this.backButtonDisabled = true;
        this.genericPinComponent.pin.validInput = true;
        this.PIN = actualIntroducedPin;
        this.passCodeEnabled = true;

        setTimeout(() => this.handleNextAction(), 2000);
    }

    private handleNoMatch(): void {
        this.genericPinComponent.pin.validInput = false;
        this.genericPinComponent.pin.resetForm();
        this.genericPinComponent.pin.shake();
    }

    private handleNextAction(): void {
        this.authorizationService.biometricsAvailable().then((result) => {
            if (result.any) {
                super.redirectTo('/profile/settings/activate-biometric', true);
            } else {
                this.routerExtensions.navigate(['/dashboard', { outlets: { dashboard: ['home'] } }], {
                    clearHistory: true,
                    transition: {
                        name: 'fade'
                    }
                });
            }
        });
    }
}
