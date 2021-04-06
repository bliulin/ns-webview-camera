import {
    Component,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { asyncScheduler, Subject } from 'rxjs';
import { PinUnlockResult } from '~/app/unlock/pin-unlock-session';
import { localize } from 'nativescript-localize';
import { PinViewComponent } from '~/app/shared/components/pin-view/pin-view.component';
import { PhoneKeyboardComponent } from '~/app/shared/components/phone-keyboard/phone-keyboard.component';
import { tap } from 'rxjs/internal/operators/tap';
import { bufferCount, delay, takeUntil } from 'rxjs/internal/operators';
import { traceDebug } from '~/app/core/logging/logging-utils';
import { BiometricIDAvailableResult } from 'nativescript-fingerprint-auth/fingerprint-auth.common';
import * as appSettings from 'tns-core-modules/application-settings';
import { Authentication } from '~/app/shared/constants';
import { AuthorizationService } from '~/app/unlock/authorization.service';
import { AuthorizationResult } from '~/app/unlock/authorization-result';

@Component({
    selector: 'omro-auth-component',
    templateUrl: './authorization.component.html',
    styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit, OnDestroy {
    @ViewChild(PinViewComponent, { static: false })
    private pinView: PinViewComponent;
    @ViewChild(PhoneKeyboardComponent, { static: false })
    private keyboard: PhoneKeyboardComponent;
    public errorMessage: string;
    private unsubscribe: Subject<void> = new Subject();
    private biometric: BiometricIDAvailableResult = { any: false };
    private showPinFocus: boolean = false;
    @Output() complete: EventEmitter<AuthorizationResult> = new EventEmitter();
    @Input() public leftKeyTemplate: TemplateRef<any>;

    constructor(
        private authorizationService: AuthorizationService,
        private routerExt: RouterExtensions,
        private ngZone: NgZone
    ) {}

    public async ngOnInit(): Promise<void> {
        asyncScheduler.schedule(() => this.init());
    }

    public ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    public onTapBiometric(): void {
        this.tryBiometricUnlock();
    }

    private async init(): Promise<void> {
        const biometricsEnabled = appSettings.getBoolean(Authentication.BiometricsEnabled);
        if (biometricsEnabled) {
            this.biometric = await this.authorizationService.biometricsAvailable();
        }

        this.keyboard.keyPressed
            .pipe(tap(() => this.pinView.enterKey('.')))
            .pipe(bufferCount(4))
            .pipe(delay(100))
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(keys => {
                this.tryPinUnlock(keys.join(''));
            });

        this.pinView.reset();
        if (this.biometric.any) {
            this.ngZone.run(() => setTimeout(() => this.tryBiometricUnlock(), 50));
        } else {
            this.ngZone.run(() => (this.showPinFocus = true));
        }
    }

    private tryBiometricUnlock(): void {
        this.showPinFocus = false;
        this.authorizationService
            .tryBiometricUnlock()
            .then(success => {
                this.complete.emit(AuthorizationResult.Success);
            })
            .catch(() => {
                this.showPinFocus = true;
            });
    }

    private tryPinUnlock(pin: string): void {
        const result = this.authorizationService.tryPinUnlock(pin);
        if (result === PinUnlockResult.OK) {
            this.complete.emit(AuthorizationResult.Success);
        } else if (result === PinUnlockResult.Invalid) {
            this.errorMessage = localize('Unlock.InvalidPin');
            this.pinView.showError();
        } else if (result === PinUnlockResult.TooManyAtempts) {
            this.reset();
            this.complete.emit(AuthorizationResult.TooManyAtempts);
        }
    }

    private reset(): void {
        this.errorMessage = '';
    }
}
