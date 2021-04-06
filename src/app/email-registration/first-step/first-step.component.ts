import { Component, ViewContainerRef, OnInit, OnDestroy } from "@angular/core";
import {
    FormGroup,
    FormBuilder,
    Validators
} from "@angular/forms";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page/page";
import { TermsAndConditionsModalComponent } from "~/app/shared/components";
import { localize } from "nativescript-localize";
import { EmailRegStateService } from "../email-state.service";
import { Account } from "../models";
import { EmailRegistrationService } from "../email-registration.service";
import { AppEvents } from "~/app/shared/constants";
import { Subscription } from "rxjs";
import { MessagingService } from "~/app/core/services/messaging.service";
import { NotificationBannerService } from "~/app/shared/services";
import { CustomValidators } from "~/app/shared/validators/validators.component";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import * as utils from "tns-core-modules/utils/utils";
import { APP_CONFIG } from "../../core/environment";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsOnboardingEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: "Featured",
    templateUrl: "./first-step.component.html",
    styleUrls: ["./first-step.component.scss"]
})
export class EmailRegFirstComponent implements OnInit, OnDestroy {
    public formGroup: FormGroup;

    private newAccount: Account;

    private emailRegistrationSubscription: Subscription;

    constructor(
        private routerExtensions: RouterExtensions,
        private page: Page,
        private modalService: OmroModalService,
        private vcRef: ViewContainerRef,
        private formBuilder: FormBuilder,
        private interactionService: EmailRegStateService,
        private emailRegistrationService: EmailRegistrationService,
        private messagingService: MessagingService,
        private notificationBannerService: NotificationBannerService,
        private analyticsService: AnalyticsService
    ) {
        this.page.actionBarHidden = true;
        this.buildForm();
    }

    public ngOnInit(): void {
        this.analyticsService.trackEvent(AppInsightsOnboardingEvents.StartRegistrationOpen, this.routerExtensions.router.url);
    }

    public ngOnDestroy(): void {
        if (this.emailRegistrationSubscription) {
            this.emailRegistrationSubscription.unsubscribe();
        }
    }

    private get email(): string {
        return this.formGroup.controls.email.value;
    }

    public hasError(fieldName: string): boolean {
        const f = this.formGroup.get(fieldName);
        return f.touched && f.invalid;
    }

    public getError(fieldName: string): string {
        const field = this.formGroup.get(fieldName);
        if (field.valid) {
            return '';
        }
        const [firstError] = Object.keys(field.errors);
        return localize(`Email.Registration.Errors.${fieldName}.${firstError}`);
    }

    public onSubmit(): void {
        this.newAccount = new Account(this.formGroup.value);
        this.analyticsService.updateUserInfo({ email: this.newAccount.email, cui: this.newAccount.cif });
        this.analyticsService.trackEvent(AppInsightsOnboardingEvents.StartRegistrationSubmit, this.routerExtensions.router.url, this.newAccount);
        this.emailRegistrationSubscription = this.emailRegistrationService.startRegistration(this.newAccount)
            .subscribe(
                response => { this.goToSecondStep(response.registrationId); this.analyticsService.trackEvent(AppInsightsOnboardingEvents.StartRegistrationOK, this.routerExtensions.router.url, response); },
                errorResponse => { this.handleError(errorResponse); this.analyticsService.trackEvent(AppInsightsOnboardingEvents.StartRegistrationERROR, this.routerExtensions.router.url, errorResponse); });
    }

    private handleError(errorResponse) {
        if (errorResponse.status === 400) {
            const error = errorResponse.error;
            switch (error.status) {
                case 401:
                    this.redirectTo('/login');
                    break;
                case 402:
                    this.notificationBannerService.showError(error, 600000);
                    break;
                case 403:
                    this.notificationBannerService.showError(error, 600000);
                    break;
                default:
                    this.notificationBannerService.showGenericError();
                    break;
            }
        } else {
            this.notificationBannerService.showGenericError(errorResponse);
        }
    }

    public onTCTap(): void {
        utils.openUrl(APP_CONFIG.privacyPolicyPageUrl);

        /*const tacContent = appSettings.getString(AppStatus.TaCContent);
        const tacVersion = appSettings.getNumber(AppStatus.TaCVersion);
        const tacLastUpdatedDate = appSettings.getString(AppStatus.TaCLastUpdate);

        this.showTermsAndConditions({
            confirmationMode: false,
            model: <TermsAndConditionsModel> {
                title: localize("TermsAndConditions.Title"),
                content: tacContent,
                version: tacVersion,
                lastUpdate: new Date(tacLastUpdatedDate)
            }
        });*/
    }

    public onGDPRTap(): void {
        utils.openUrl(APP_CONFIG.gdprPageUrl);

        /*const gdprContent = appSettings.getString(AppStatus.MarketingAccord);

        this.showTermsAndConditions({
            confirmationMode: false,
            model: <TermsAndConditionsModel> {
                title: localize("GDPRAccord.Title"),
                content: gdprContent
            }
        });*/
    }

    public onLogInTap(): void {
        this.redirectTo('/login');
    }

    private buildForm(): void {
        this.formGroup = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            cif: ['', [Validators.required, CustomValidators.validateCUI()]],
            termsAndConditionsAccepted: [false, Validators.requiredTrue],
            marketingConsentIsGiven: [false]
        });
    }

    private goToSecondStep(registrationId: string): void {
        this.interactionService.userEmail = this.email;
            this.interactionService.registrationId = registrationId;
            this.messagingService.setState(AppEvents.RegistrationId, registrationId);
            this.redirectTo('/emailreg/second');
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate([path], {
            transition: {
                name: "fade"
            }
        });
    }

    private showTermsAndConditions(context?: any): Promise<boolean> {
        const options = {
            context: context || {},
            fullscreen: true,
            viewContainerRef: this.vcRef,
            animated: true
        };

        return <Promise<boolean>>this.modalService.showModal(TermsAndConditionsModalComponent, options);
    }
}
