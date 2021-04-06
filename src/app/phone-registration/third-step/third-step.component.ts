import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { localize } from "nativescript-localize";
import {
    FormBuilder,
    FormGroup,
    Validators
} from "@angular/forms";
import { RouterExtensions } from "nativescript-angular";
import { PhoneRegistrationStateService } from "~/app/phone-registration/phone-registration-state.service";
import { PhoneRegistrationApiService } from "~/app/phone-registration/phone-registration-api.service";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationBannerService } from "~/app/shared/services";
import { DialogResult } from "~/app/shared/app.enums";
import { CancelPopupComponent } from "~/app/phone-registration/components/cancel-popup/cancel-popup.component";
import { FinishRegistrationResponse } from "~/app/phone-registration/models/request-types";
import { MessagingService } from "~/app/core/services/messaging.service";
import { AppEvents, AppStatus } from "~/app/shared/constants";
import { Page } from "tns-core-modules/ui/page/page";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { KeystoreService } from "~/app/core/services/keystore.service";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsOnboardingEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: "ns-third-step",
    templateUrl: "./third-step.component.html",
    styleUrls: ["./third-step.component.scss"]
})
export class ThirdStepComponent implements OnInit {
    public formGroup: FormGroup;
    // at least 8 characters long, at least 1 lowercase, at least one upper case,
    // at least one digit, at least one non-alphanumeric
    private readonly passwordRegex: RegExp = new RegExp(
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})"
    );
    showPassword_Set: boolean = false;
    showPassword_Confirm: boolean = false;

    constructor(
        private page: Page,
        private formBuilder: FormBuilder,
        private routerExtensions: RouterExtensions,
        private stateService: PhoneRegistrationStateService,
        private phoneRegistrationService: PhoneRegistrationApiService,
        private notificationBannerService: NotificationBannerService,
        private modalService: OmroModalService,
        private messagingService: MessagingService,
        private vcRef: ViewContainerRef,
        private keyStore: KeystoreService,
        private analyticsService: AnalyticsService
        ) {
        this.page.actionBarHidden = true;
        this.formGroup = this.formBuilder.group({
            password: ["", [Validators.required, Validators.pattern(this.passwordRegex)]],
            confirmPassword: ["", Validators.required]
        });
        this.formGroup.setValidators(this.passwordsMatchValidator);
    }

    public ngOnInit(): void {
        this.analyticsService.trackEvent(AppInsightsOnboardingEvents.SetPasswordOpen, this.routerExtensions.router.url);
    }

    public passwordsMatchValidator(formGroup: FormGroup): { [key: string]: any } | null {
        const p1 = formGroup.get("password").value.toString();
        const p2 = formGroup.get("confirmPassword").value.toString();
        if (p1 !== p2) {
            return { passwordsMatch: true };
        }
        return null;
    }

    public async onTapCancel(): Promise<void> {
        const result = <DialogResult>await this.modalService.showModal(
            CancelPopupComponent,
            {
                animated: false,
                viewContainerRef: this.vcRef,
                fullscreen: true
            }
        );

        if (result === DialogResult.Yes) {
            setTimeout(() => this.redirectTo('/emailreg'), 50);
        }
    }

    public onTapCreateAccount(): void {
        Object.keys(this.formGroup.controls).forEach(field => {
            const control = this.formGroup.get(field);
            control.markAsTouched();
        });
        if (!this.formGroup.valid) {
            return;
        }
        this.analyticsService.trackEvent(AppInsightsOnboardingEvents.SetPasswordSubmit, this.routerExtensions.router.url);

        this.phoneRegistrationService
            .finishRegistration({
                registrationId: this.stateService.registrationId,
                password: this.formGroup.get("password").value
            })
            .subscribe(
                (response) => { this.analyticsService.trackEvent(AppInsightsOnboardingEvents.SetPasswordOK, this.routerExtensions.router.url, response); this.handleSuccess(response); },
                error => { this.analyticsService.trackEvent(AppInsightsOnboardingEvents.SetPasswordERROR, this.routerExtensions.router.url, error); this.handleError(error) }
            );
    }

    public hasError(fieldName: string): boolean {
        const f = this.formGroup.get(fieldName);
        return f.touched && f.invalid;
    }

    public getError(fieldName?: string): string {
        const field = this.formGroup.get(fieldName);
        if (!field.invalid) {
            return "";
        }
        const [firstError] = Object.keys(field.errors);
        return localize(
            `PhoneRegistration.ThirdStep.Errors.password.${firstError}`
        );
    }

    public get confirmPasswordHasError(): boolean {
        const f = this.formGroup.get('confirmPassword');
        return f.touched && (f.invalid || this.formGroup.invalid);
    }

    public get confirmPasswordError(): string {
        const error = this.getError("confirmPassword");
        if (error) {
            return error;
        }

        if (!this.formGroup.errors) {
            return "";
        }
        const [firstError] = Object.keys(this.formGroup.errors);
        return localize(
            `PhoneRegistration.ThirdStep.Errors.password.${firstError}`
        );
    }

    private handleError(response: HttpErrorResponse): void {
        const error = response.error;
        if (response.status === 400) {
           this.notificationBannerService.showError(error, 6000);
        } else {
            this.notificationBannerService.showError({title:'Error',detail:'An unexpected server error has occured!'});
        }
    }

    private handleSuccess(response: FinishRegistrationResponse): void {
        this.keyStore.set(AppStatus.RefreshToken, response.refreshToken);
        this.keyStore.set(AppStatus.IdToken, response.idToken);        
        this.messagingService.setState(AppEvents.RefreshToken, response.refreshToken);
        this.redirectTo("/profile/settings/set-pin/set");
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate([path], {
            transition: {
                name: "fade"
            },
            clearHistory: true
        });
    }
}
