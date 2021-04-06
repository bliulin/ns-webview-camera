import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

import * as appSettings from 'tns-core-modules/application-settings';
import { Onboarding } from '~/app/shared/constants';
import { traceDebug } from '../logging/logging-utils';

@Injectable()
export class OnboardingGuardService implements CanActivate {
    constructor(private routerExtensions: RouterExtensions) {}

    public canActivate(): any {
        const isOnboardingCompleted = Boolean(appSettings.getBoolean(Onboarding.onboardingCompleted));
        traceDebug('🛡️ [OnboardingGuard] Is onboarding completed:' + isOnboardingCompleted);
        if (!isOnboardingCompleted) {
            traceDebug('🛡️ [OnboardingGuard] Redirect to onboarding.');
            return this.routerExtensions.router.parseUrl('onboarding');
        }
        return true;
    }
}
