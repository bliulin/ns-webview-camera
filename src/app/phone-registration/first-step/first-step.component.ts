import { Component, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { localize } from "nativescript-localize";
import { RouterExtensions } from "nativescript-angular";
import { PrefixPickerComponent } from "~/app/phone-registration/components/prefix-picker/prefix-picker.component";
import { PhonePrefix, PREFIXES } from "~/app/phone-registration/models/phone-prefix";
import { PhoneRegistrationStateService } from "~/app/phone-registration/phone-registration-state.service";
import { User } from "~/app/phone-registration/models/user";
import { PhoneRegistrationApiService } from "~/app/phone-registration/phone-registration-api.service";
import { MessagingService } from "~/app/core/services/messaging.service";
import { CancelPopupComponent } from "~/app/phone-registration/components/cancel-popup/cancel-popup.component";
import { DialogResult } from "~/app/shared/app.enums";
import { AppEvents, AppStatus} from "~/app/shared/constants";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationBannerService } from "~/app/shared/services";
import { Page } from "tns-core-modules/ui/page/page";
import { takeUntil } from "rxjs/internal/operators";
import { Subject } from "rxjs";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsOnboardingEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: "ns-first-step",
    templateUrl: "./first-step.component.html",
    styleUrls: ["./first-step.component.scss"]
})
export class FirstStepComponent implements OnInit, OnDestroy {
    private selectedPrefix: PhonePrefix;
    public formGroup: FormGroup;
    private unsubscribe: Subject<any> = new Subject();

    constructor(private formBuilder: FormBuilder,
                private page: Page,
                private modalService: OmroModalService,
                private vcRef: ViewContainerRef,
                private stateService: PhoneRegistrationStateService,
                private phoneRegistrationApiService: PhoneRegistrationApiService,
                private messagingService: MessagingService,
                private routerExtensions: RouterExtensions,
                private notificationBannerService: NotificationBannerService,
                private analyticsService: AnalyticsService
    ) {
        this.page.actionBarHidden = true;
        this.selectedPrefix = PREFIXES.find(p => p.code === AppStatus.DefaultCountryPrefix);
        this.formGroup = this.formBuilder.group({
            firstName: ["", Validators.required],
            lastName: ["", Validators.required],
            phoneNumber: ["", [ Validators.required, Validators.pattern('^\\d{9}$')]],
            countryPrefix: [this.selectedPrefix.prefix, Validators.required]
        });
    }

    public get formatedPrefix(): string {
        const p = this.selectedPrefix;
        return p ? `${p.prefix} (${p.code})` : '';
    }

    public ngOnInit(): void {
        this.messagingService.getState<string>(AppEvents.RegistrationId)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((registrationId) => {
            this.stateService.registrationId = registrationId;
        });
        this.analyticsService.trackEvent(AppInsightsOnboardingEvents.RegisterPhoneOpen, this.routerExtensions.router.url);
    }

    public ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private hasError(fieldName: string): boolean {
        const f = this.formGroup.get(fieldName);
        return f.touched && f.invalid;
    }

    private getError(fieldName: string): string {
        const field = this.formGroup.get(fieldName);
        if (!field.invalid) {
            return '';
        }
        const [firstError] = Object.keys(field.errors);
        return localize(`PhoneRegistration.FirstStep.Errors.${fieldName}.${firstError}`);
    }

    private async onTapPrefix(): Promise<void> {
        let result: PhonePrefix;
        result = await this.modalService.showModal(PrefixPickerComponent, {
            animated: true,
            viewContainerRef: this.vcRef,
            fullscreen: false,
            context: {
                items: PREFIXES
            }
        });
        if (result) {
            this.selectedPrefix = result;
            this.formGroup.patchValue({
                countryPrefix: result.prefix
            });
        }
    }

    private onTapContinue(): void {
        Object.keys(this.formGroup.controls).forEach(field => {
            const control = this.formGroup.get(field);
            control.markAsTouched();
        });
        if (!this.formGroup.valid) {
            return;
        }
        this.stateService.user = <User>(this.formGroup.value);
        this.analyticsService.updateUserInfo({ 
            phoneNumber: this.stateService.user.phoneNumber, 
            firstName: this.stateService.user.firstName, 
            lastName: this.stateService.user.lastName });
        this.analyticsService.trackEvent(AppInsightsOnboardingEvents.RegisterPhoneSubmit, this.routerExtensions.router.url, this.stateService.user);

        this.phoneRegistrationApiService
            .registerPhone({
                ...this.stateService.user,
                registrationId : this.stateService.registrationId
            })
            .subscribe(
                response => { 
                    this.analyticsService.updateUserInfo({ 
                        phoneNumber: this.stateService.user.phoneNumber, 
                        fullName: `${this.stateService.user.firstName} ${this.stateService.user.lastName}` });
                    this.analyticsService.trackEvent(AppInsightsOnboardingEvents.RegisterPhoneOK, this.routerExtensions.router.url, response); 
                    this.goToSecondStep(); },
                error => { this.analyticsService.trackEvent(AppInsightsOnboardingEvents.RegisterPhoneERROR, this.routerExtensions.router.url, error); this.handleError(error) });
    }

    private async onTapCancel(): Promise<void> {
        const result = <DialogResult>await this.modalService.showModal(CancelPopupComponent, {
            animated: false,
            viewContainerRef: this.vcRef,
            fullscreen: true
        });

        if (result === DialogResult.Yes) {
            // the setTimeout is needed so we perform the redirect outside of the modal callback
            // othwewise it will not work
            setTimeout(() => this.redirectTo('/emailreg'), 50);
        }
    }

    private handleError(response: HttpErrorResponse): void {
        const error = response.error;
        if (response.status === 400) {
            switch (error.status) {
                case 401:
                case 402:
                    this.notificationBannerService.showError(error);
                    break;
                default:
                    this.notificationBannerService.showError(error);
                    break;
            }
        } else {
            this.notificationBannerService.showGenericError();
        }
    }

    private goToSecondStep(): void {
        this.redirectTo('/phonereg/second', false);
    }

    private redirectTo(path: string, clearHistory: boolean = true): void {
        this.routerExtensions.navigate([path], {
            transition: {
                name: "fade"
            },
            clearHistory: clearHistory
        });
    }
}
