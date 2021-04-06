import { Component, OnInit, ViewChild } from "@angular/core";
import { BehaviorSubject, combineLatest, Observable, timer } from "rxjs";
import { RouterExtensions } from "nativescript-angular";
import { filter, map } from "rxjs/internal/operators";
import { Page } from "tns-core-modules/ui/page/page";
import { PhoneRegistrationStateService } from "~/app/phone-registration/phone-registration-state.service";
import { User } from "~/app/phone-registration/models/user";
import { PhoneRegistrationApiService } from "~/app/phone-registration/phone-registration-api.service";
import { NotificationBannerService } from "~/app/shared/services";
import { localize } from "nativescript-localize";
import { HttpErrorResponse } from "@angular/common/http";
import { Location } from "@angular/common";
import { ValidationCodeInputComponent } from "~/app/shared/components";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsOnboardingEvents } from "~/app/core/models/app-insights-events";

@Component({
    templateUrl: "./second-step.component.html",
    styleUrls: ["./second-step.component.scss"]
})
export class SecondStepComponent implements OnInit {
    public user: User;
    private resendCodeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    public counter$: Observable<number>;
    public count: number = 0;
    public resendCodeAction$: Observable<boolean> = this.resendCodeSubject.asObservable();
    @ViewChild(ValidationCodeInputComponent, { static: false })
    public pin: ValidationCodeInputComponent;

    constructor(
        private page: Page,
        private location: Location,
        private routerExtensions: RouterExtensions,
        private stateService: PhoneRegistrationStateService,
        private phoneRegistrationService: PhoneRegistrationApiService,
        private notificationBannerService: NotificationBannerService,
        private analyticsService: AnalyticsService
    ) {
        this.page.actionBarHidden = true;
        this.page.on("navigatedTo", () => this.pin.focus());
    }

    public ngOnInit(): void {
        this.user = this.stateService.user;
        this.analyticsService.trackEvent(AppInsightsOnboardingEvents.ValidatePhoneOpen, this.routerExtensions.router.url);
    }

    public timer$: Observable<number> = combineLatest([
        (this.counter$ = timer(0, 1000)),
        this.resendCodeAction$
    ]).pipe(
        filter(() => this.count > 0),
        map(() => --this.count)
    );

    public sendCode(code: string): void {
        this.analyticsService.trackEvent(AppInsightsOnboardingEvents.ValidatePhoneSubmit, this.routerExtensions.router.url, {
            registrationId: this.stateService.registrationId,
            phoneValidationCode: code
        });
        this.phoneRegistrationService
            .validatePhone({
                registrationId: this.stateService.registrationId,
                phoneValidationCode: code
            })
            .subscribe(
                (response) => { this.analyticsService.trackEvent(AppInsightsOnboardingEvents.ValidatePhoneOK, this.routerExtensions.router.url, response); this.redirectTo("/phonereg/third"); },
                error => { this.analyticsService.trackEvent(AppInsightsOnboardingEvents.ValidatePhoneERROR, this.routerExtensions.router.url, error); this.handleError(error) }
            );
    }

    public onResendCodeTap(): void {
        if (this.count === 0) {
            this.resendCode();
        }
    }

    public goBack(): void {
        this.location.back();
    }

    private handleError(response: HttpErrorResponse): void {
        const error = response.error;
        if (response.status === 400) {
            switch (error.status) {
                case 402:
                    this.notificationBannerService.showError(error, 6000);
                    break;
                case 403:
                    this.notificationBannerService.showWarning(error, 6000);
                    break;
                default:
                    this.notificationBannerService.showError(error, 6000);
                    break;
            }
        } else {
            this.notificationBannerService.showGenericError();
        }
    }

    private resendCode(): void {
        this.phoneRegistrationService
            .resendPhoneCode({
                registrationId: this.stateService.registrationId
            })
            .subscribe(
                () => this.resetTimerAndShowBannerNotification(),
                response => this.handleError(response)
            );
    }

    private resetTimerAndShowBannerNotification(): void {
        this.resetCountdown();
        this.notificationBannerService.showSuccess(
            localize("PhoneRegistration.SecondStep.CodeSent"),
            localize("PhoneRegistration.SecondStep.AnewCodeWasSent")
        );
        this.resendCodeSubject.next(true);
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate([path], {
            transition: {
                name: "fade"
            },
            clearHistory: true
        });
    }

    private resetCountdown(): void {
        this.count = 30;
    }
}
