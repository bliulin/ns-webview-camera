import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular/router';
import * as appSettings from 'tns-core-modules/application-settings';
import { Authentication } from '~/app/shared/constants';
import { traceDebug } from '~/app/core/logging/logging-utils';
import { BiometricIDAvailableResult } from 'nativescript-fingerprint-auth/fingerprint-auth.common';
import { AuthorizationService } from "~/app/unlock/authorization.service";

const iOSBiometricsPermissionDenied = -6;
@Component({
    selector: 'ns-activate-biometric',
    templateUrl: './activate-biometric.component.html',
    styleUrls: ['./activate-biometric.component.scss']
})
export class ActivateBiometricComponent implements OnInit {
    public unlockAvaible: Partial<BiometricIDAvailableResult> = {};

    constructor(private routerExtensions: RouterExtensions, public page: Page, public authorizationService: AuthorizationService) {
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.authorizationService.biometricsAvailable().then(result => (this.unlockAvaible = result));
    }

    public onCancelTap(): void {
        if (this.routerExtensions.canGoBack()) {
            this.routerExtensions.back();
        } else {
            this.redirectTo('home');
        }
    }

    public checkFingerPrint(): void {
        this.authorizationService
            .tryBiometricUnlock()
            .then(success => {
                traceDebug(`bio unlock: ${success}`);
                appSettings.setBoolean(Authentication.BiometricsEnabled, true);
                this.redirect();
            })
            .catch(error => {
                if (error.code === iOSBiometricsPermissionDenied) {
                    this.redirect();
                }
            });
    }

    private redirect(): void {
        if (this.routerExtensions.canGoBack()) {
            this.routerExtensions.back();
        } else {
            this.redirectTo('home');
        }
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate(['/dashboard', { outlets: { dashboard: [path] } }], {
            clearHistory: true,
            transition: {
                name: 'fade'
            }
        });
    }
}
