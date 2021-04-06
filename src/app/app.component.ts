import { ChangeDetectorRef, Component, OnInit, ViewContainerRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import { filter, map } from 'rxjs/operators';
import { initializeTracing, traceDebug, traceError } from './core/logging/logging-utils';
import { ActivityLoaderService } from '~/app/core/services/activity-loader.service';
import { isAndroid, Page } from 'tns-core-modules/ui/page/page';
import { AppURL, handleOpenURL } from 'nativescript-urlhandler';
import { UnlockService } from '~/app/core/services/unlock.service';
import { MessagingService } from '~/app/core/services/messaging.service';
import { AppEvents } from '~/app/shared/constants';
import { EMPTY, interval, Observable } from 'rxjs';
import { delayWhen } from 'rxjs/internal/operators/delayWhen';
import { PushNotificationsService } from "~/app/core/services/push-notifications/push-notifications.service";
import { AppState } from "~/app/shared/models";
import { initLocale } from '~/app/shared/utils/date-time-format-utils';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsProductRequestEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: 'ns-app',
    templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
    private _activatedUrl: string;
    private routerOutletHidden$: Observable<boolean>;
    private lockScreenVisible$: Observable<boolean>;

    constructor(
        private page: Page,
        private router: Router,
        private routerExtensions: RouterExtensions,
        public activityLoaderService: ActivityLoaderService,
        private unlockService: UnlockService,
        private messagingService: MessagingService,
        private cdRef: ChangeDetectorRef,
        private pushNotificationService: PushNotificationsService,
        private modalsService: OmroModalService,
        private vcRef: ViewContainerRef,
        private analyticsService: AnalyticsService
    ) {
        // delay hiding the Lock Screen for 100ms to avoid a screen flicker
        this.lockScreenVisible$ = unlockService.locked$.pipe(delayWhen(locked => (locked ? EMPTY : interval(100))));
        this.routerOutletHidden$ = unlockService.locked$.pipe(map(locked => (isAndroid ? false : locked)));

        this.messagingService.setState<ViewContainerRef>('vcRef', this.vcRef);
    }

    public ngOnInit(): void {
        // this.registerForPushMessages();
        initLocale('ro');

        this._activatedUrl = '/home';

        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this._activatedUrl = event.urlAfterRedirects;
                traceDebug('activatedUrl: ' + this._activatedUrl);
            });

        handleOpenURL((appURL: AppURL) => {
            traceDebug('Got the following appURL: ' + appURL);
            if (appURL.path.includes("kyc/kyc-redirect-finish")){
                this.analyticsService.trackEvent(AppInsightsProductRequestEvents.KYCRedirectFinish, this.routerExtensions.router.url, appURL.path);
                this.routerExtensions.navigateByUrl(appURL.path);
            }
        });

        initializeTracing();

        this.messagingService.getState(AppEvents.AppState)
            .subscribe(state => {
                if (state === AppState.RESUMED) {
                    this.cdRef.detectChanges();
                }
                else if (state === AppState.SUSPENDED) {
                    this.modalsService.closeLastModal();
                }
            });
    }

    public onAppStatusError($event: any): void {
        traceError('Error: ' + $event);
        this.routerExtensions.navigate(['./appStatusError/' + $event]);
    }

    private registerForPushMessages(): void {
        this.pushNotificationService.registerPushHandlers();
    }
}
