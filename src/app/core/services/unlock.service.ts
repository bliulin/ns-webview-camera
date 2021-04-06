import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, timer } from 'rxjs';
import { map, mapTo, startWith, timeout } from 'rxjs/internal/operators';
import { traceDebug, traceError } from '~/app/core/logging/logging-utils';
import { RouterExtensions } from 'nativescript-angular';
import { AppEvents, Authentication, Constants } from '~/app/shared/constants';
import { merge } from 'rxjs/internal/observable/merge';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { filter } from 'rxjs/internal/operators/filter';
import { FingerprintAuth } from 'nativescript-fingerprint-auth';
import { KeystoreService } from './keystore.service';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import * as appSettings from 'tns-core-modules/application-settings';
import { AuthenticationService } from '~/app/core/authentication/authentication.service';
import { MessagingService } from '~/app/core/services/messaging.service';
import { CancelToken } from '~/app/core/services/cancelToken';

@Injectable({
    providedIn: 'root'
})
export class UnlockService {
    private static _instance: UnlockService;

    private isEnabledAction$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private isSuspendedAction$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private isLockedAction$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private _locked$: Observable<boolean>;

    private _isLocked: boolean = true;

    private locklessSuspend: boolean = false;

    constructor(
        private routerExtensions: RouterExtensions,
        private ngZone: NgZone,
        private fingerpringAuth: FingerprintAuth,
        private keyStore: KeystoreService,
        private authService: AuthenticationService,
        private messagingService: MessagingService
    ) {
        UnlockService._instance = this;
        this.checkEnabled();
        this.initObservables();
        this.messagingService.getState(AppEvents.LoggedOut).subscribe(() => {
            this.checkEnabled();
        });
        this.messagingService.getState(AppEvents.LoggedIn).subscribe(() => {
            this.unlock();
            this.checkEnabled();
        });
    }

    public static get instance(): UnlockService {
        return UnlockService._instance;
    }

    public get isLocked(): boolean {
        return this._isLocked;
    }

    public get locked$(): Observable<boolean> {
        return this._locked$;
    }

    public lock(): void {
        this.isLockedAction$.next(true);
        traceDebug('🔒 [UnlockService] App locked');
    }

    public unlock(): void {
        this.isLockedAction$.next(false);
        traceDebug('🔒 [UnlockService] App unlocked');
    }

    public resume(): void {
        traceDebug('🔒 [UnlockService] Resumed');
        if (this.locklessSuspend) {
            return;
        }
        this.isSuspendedAction$.next(false);
        this.checkForLocked();
    }

    public suspend(): void {
        traceDebug('🔒 [UnlockService] Suspended');
        if (this.locklessSuspend) {
            return;
        }
        this.isSuspendedAction$.next(true);
    }

    public enableLocklessSuspend(): CancelToken {
        if (this.locklessSuspend) {
            traceError('Lockless Suspend is already enabled');
            return;
        }

        this.locklessSuspend = true;
        const cancelSubject = new Subject<any>();
        cancelSubject.pipe(timeout(60000)).subscribe(
            () => (this.locklessSuspend = false),
            () => (this.locklessSuspend = false)
        );
        return new CancelToken(cancelSubject);
    }

    private initObservables(): void {
        traceDebug('🔒 [UnlockService] Init');

        const timedLockObs = this.isSuspendedAction$.pipe(
            switchMap(s => (s ? timer(Constants.AppLockTimeoutMilis).pipe(mapTo(true)) : EMPTY))
        );

        const lockObs = merge(timedLockObs, this.isLockedAction$)
            .pipe(startWith(true))
            .pipe(filter(v => v !== undefined));

        this._locked$ = combineLatest([lockObs, this.isEnabledAction$]).pipe(
            map(([locked, enabled]) => locked && enabled)
        );

        this.locked$.subscribe(val => {
            traceDebug(`🔒 [UnlockService] App locked: ${val}`);
            this._isLocked = val;
        });
    }

    private checkEnabled(): void {
        const loggedIn = this.authService.isLoggedIn();
        const biometricsEnabled = appSettings.getBoolean(Authentication.BiometricsEnabled);
        const passCodeEnabled = appSettings.getBoolean(Authentication.PassCodeEnabled);
        const securityEnabled = biometricsEnabled || passCodeEnabled;
        this.isEnabledAction$.next(loggedIn && securityEnabled);
    }

    private checkForLocked(): void {
        this.checkEnabled();
        if (this._isLocked) {
            traceDebug(`🔒 [UnlockService] Redirect -> Locked`);
        }
    }
}
