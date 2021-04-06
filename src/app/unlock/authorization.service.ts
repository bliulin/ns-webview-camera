import { Injectable } from '@angular/core';
import { localize } from 'nativescript-localize';
import { traceDebug, traceError } from '~/app/core/logging/logging-utils';
import { PinUnlockResult, PinUnlockSession } from './pin-unlock-session';
import { AppEvents, Authentication, Constants } from '~/app/shared/constants';
import { FingerprintAuth } from 'nativescript-fingerprint-auth';
import { KeystoreService } from '~/app/core/services/keystore.service';
import { BiometricIDAvailableResult } from 'nativescript-fingerprint-auth/fingerprint-auth.common';
import { MessagingService } from '~/app/core/services/messaging.service';
import { asyncScheduler, Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { delay, observeOn } from 'rxjs/internal/operators';
import { RouterExtensions } from 'nativescript-angular';
import { AuthorizationIntent } from '~/app/unlock/authorizationIntent';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {
    private pinUnlockSession: PinUnlockSession;
    private authorizationIntent: AuthorizationIntent;

    constructor(
        private fingerpringAuth: FingerprintAuth,
        private keyStore: KeystoreService,
        private messagingService: MessagingService,
        public routerExt: RouterExtensions
    ) {
        this.messagingService.getState(AppEvents.LoggedOut).subscribe(() => {
            this.reset();
        });
    }

    public tryBiometricUnlock(): Promise<void> {
        traceDebug('🔒 [AuthorizationService] Atempting biometrick unlock');
        return this.fingerpringAuth
            .verifyFingerprint({
                title: localize('Unlock.TouchIdForOmro'),
                message: localize('Unlock.UseFingerprintToAuth'),
                negativeButtonText: localize('Common.Cancel')
            })
            .then(() => {
                traceDebug('🔒 [AuthorizationService] Biometric ID OK');
                return Promise.resolve();
            })
            .catch(err => {
                traceDebug(`🔒 [AuthorizationService] Biometric ID FAILED: ${JSON.stringify(err)}`);
                return Promise.reject(err);
            });
    }

    public tryPinUnlock(pin: string): PinUnlockResult {
        traceDebug('🔒 [AuthorizationService] Atempting PIN unlock');
        if (!this.pinUnlockSession) {
            const userPin = this.keyStore.getSync(Authentication.Pin);
            this.pinUnlockSession = new PinUnlockSession(userPin, Constants.MaxPinAtempts);
        }
        const result = this.pinUnlockSession.tryUnlock(pin);
        if (result === PinUnlockResult.OK) {
            traceDebug('🔒 [AuthorizationService] PIN OK');
            this.reset();
        }
        return result;
    }

    public async biometricsAvailable(): Promise<BiometricIDAvailableResult> {
        try {
            const result = await this.fingerpringAuth.available();
            return result;
        } catch (err) {
            traceError('🔒 [AuthorizationService] Error:' + JSON.stringify(err));
            return { any: false, touch: false, face: false };
        }
    }

    public authorizeAction(): Observable<void> {
        traceDebug('🔒 [AuthorizationService] Authorizing action');
        this.authorizationIntent = new AuthorizationIntent();
        this.routerExt.navigate(['authorize'], { transition: { name: 'fade' } });

        return this.authorizationIntent.observable
            .pipe(
                tap(
                    () => {
                        traceDebug('🔒 [AuthorizationService] Authorization successful');
                        this.authorizationIntent = null;
                    },
                    e => {
                        traceDebug('🔒 [AuthorizationService] Authorization failed');
                        this.authorizationIntent = null;
                    }
                )
            )
            .pipe(delay(500))
            .pipe(observeOn(asyncScheduler));
    }

    public getAuthorizationIntent(): AuthorizationIntent {
        return this.authorizationIntent;
    }

    private reset(): void {
        this.pinUnlockSession = null;
    }


}
