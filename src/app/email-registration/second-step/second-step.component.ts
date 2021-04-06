import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, timer, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, filter, takeUntil, take } from 'rxjs/operators';
import { EmailRegStateService } from '../email-state.service';
import { EmailRegistrationService } from '../email-registration.service';
import { ValidationCodeRequest } from '../models';
import { RouterExtensions } from 'nativescript-angular/router';
import { NotificationBannerService } from '~/app/shared/services';
import localize from 'nativescript-localize';
import { Page } from 'tns-core-modules/ui/page/page';
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsOnboardingEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: 'omro-email-confirmation',
    templateUrl: './second-step.component.html',
    styleUrls: ['./second-step.component.scss']
})
export class EmailRegSecondComponent implements OnDestroy {
    public counter$: Observable<number>;
    private unsubscribe$: Subject<void> = new Subject<void>();
    public count: number = 0;

    private validationCode: ValidationCodeRequest;

    constructor(
        private page: Page,
        private location: Location,
        private routerExtensions: RouterExtensions,
        private interactionService: EmailRegStateService,
        private emailRegistrationService: EmailRegistrationService,
        private notificationBannerService: NotificationBannerService,
        private analyticsService: AnalyticsService
    ) {
        this.page.actionBarHidden = true;
        this.analyticsService.trackEvent(AppInsightsOnboardingEvents.ValidateEmailOpen, this.routerExtensions.router.url);
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    public get userEmail(): string {
        return this.interactionService.userEmail;
    }

    private get registrationId(): string {
        return this.interactionService.registrationId;
    }

    private resendCodeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public resendCodeAction$: Observable<boolean> = this.resendCodeSubject.asObservable();

    public timer$: Observable<number> = combineLatest([(this.counter$ = timer(0, 1000)), this.resendCodeAction$])
        .pipe(takeUntil(this.unsubscribe$))
        .pipe(
            filter(() => this.count > 0),
            map(() => --this.count)
        );

    public sendCode(code: string): void {
        this.validationCode = new ValidationCodeRequest({
            registrationId: this.registrationId,
            emailValidationCode: code
        });
        this.analyticsService.trackEvent(AppInsightsOnboardingEvents.ValidateEmailSubmit, this.routerExtensions.router.url, this.validationCode);
        this.emailRegistrationService.validateEmail(this.validationCode)
        .pipe(take(1))
        .subscribe(
            (response) => { this.analyticsService.trackEvent(AppInsightsOnboardingEvents.ValidateEmailOK, this.routerExtensions.router.url, response); this.redirectTo('/phonereg')},
            error => {
                this.analyticsService.trackEvent(AppInsightsOnboardingEvents.ValidateEmailERROR, this.routerExtensions.router.url, error);
                const errorResponse = error.error;
                switch (error.error.status) {
                    case 402:
                        this.notificationBannerService.showError(errorResponse);
                        break;
                    case 403:
                        this.notificationBannerService.showError(errorResponse);
                        break;
                    default:
                        this.notificationBannerService.showGenericError(errorResponse);
                        break;
                }
            }
        );
    }

    public goBack(): void {
        this.location.back();
    }

    public onResendCodeTap(): void {
        if (this.count === 0) {
            this.resendCode();
        }
    }

    private resendCode(): void {
        this.emailRegistrationService.resendEmailCode(this.registrationId)
        .pipe(take(1))
        .subscribe(
            () => this.resetTimerAndShowBannerNotification(),
            error => {
                const errorResponse = error.error;
                switch (error.error.status) {
                    case 402:
                        this.notificationBannerService.showError(errorResponse);
                        break;
                    default:
                        this.notificationBannerService.showGenericError(errorResponse);
                        break;
                }
            }
        );
    }

    private resetTimerAndShowBannerNotification(): void {
        this.resetCountdown();
        this.notificationBannerService.showSuccess(
            localize('Email.Confirmation.ResendCodeSuccessBanner.Title'),
            localize('Email.Confirmation.ResendCodeSuccessBanner.Details')
        );
        this.resendCodeSubject.next(true);
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate([path], {
            clearHistory: true,
            transition: {
                name: 'fade'
            }
        });
    }

    private resetCountdown(): void {
        this.count = 30;
    }
}
