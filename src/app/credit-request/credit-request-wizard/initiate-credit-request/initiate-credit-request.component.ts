import { Component, EventEmitter, OnInit, Output, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterExtensions } from 'nativescript-angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import localize from 'nativescript-localize';
import { ProductRequestModel } from '~/app/credit-request/models/productRequestModel';
import { ProductRequestFlowOutputModel } from '~/app/credit-request/models/productRequestFlowOutputModel';
import { NotificationBannerService } from '~/app/shared/services';
import { Page } from 'tns-core-modules/ui/page';
import { CreditRequestService } from '~/app/credit-request/services/credit-request.service';
import { InitiateProductRequestViewModel } from '../models/initiate-product-request-view-model';
import { UiService } from '~/app/credit-request/services/ui.service';
import { MessagingService } from '~/app/core/services/messaging.service';
import { ProductRequestEvents } from '~/app/shared/constants';
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsProductRequestEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: 'omro-initiate-credit-request',
    templateUrl: './initiate-credit-request.component.html',
    styleUrls: ['./initiate-credit-request.component.scss']
})
export class InitiateCreditRequestComponent implements OnInit {
    public form: FormGroup;
    public vm$: Observable<InitiateProductRequestViewModel>;
    monthFormatter = v => `${v} ${localize('Common.Months').toLowerCase()}`;
    @Output()
    public completed: EventEmitter<any> = new EventEmitter();

    constructor(
        private page: Page,
        private formBuilder: FormBuilder,
        private routerExtensions: RouterExtensions,
        private service: CreditRequestService,
        private uiService: UiService,
        private notificationBannerService: NotificationBannerService,
        private messagingService: MessagingService,
        private analyticsService: AnalyticsService
    ) {
        this.page.actionBarHidden = true;
        this.buildForm();
        this.vm$ = this.uiService.eligibleStandardProduct$
            .pipe(map(p => new InitiateProductRequestViewModel(p)))
            .pipe(tap(value => this.form.patchValue(value)));
    }

    public async ngOnInit(): Promise<void> {
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.StartProductRequestOpen, this.routerExtensions.router.url);
     }

    public goBack(): void {
        this.routerExtensions.backToPreviousPage();
    }

    public onNextTap(): void {
        if (!this.form.valid) {
            return;
        }
        const productRequestModel = <ProductRequestModel>{ ...this.form.value };
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.StartProductRequestSubmit, this.routerExtensions.router.url, productRequestModel);
        this.service.requestNewProduct(productRequestModel).subscribe(
            success => this.handleSuccess(success),
            error => this.handleError(error)
        );
    }

    private handleSuccess(productRequestFlow: ProductRequestFlowOutputModel): void {
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.StartProductRequestOK, this.routerExtensions.router.url, productRequestFlow);
        this.messagingService.raiseEvent(ProductRequestEvents.InitiateProductRequestCompleted, {});
        this.completed.emit(productRequestFlow);
    }

    private handleError(error: any): void {
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.StartProductRequestERROR, this.routerExtensions.router.url, error);
        const errorDetails = error.error || null;
        switch (error.status) {
            case 400:
                switch (errorDetails.status) {
                    case 400:
                        {
                            // new error codes
                            if (errorDetails.platformcode === "FLB_DuplicatedProductRequestForCustomer")
                                this.notificationBannerService.showError(errorDetails);
                            else alert('Bug in FE');
                        }
                        break;
                    case 401:
                    case 402:
                    case 411:
                        {
                            // the company is not eligible from different reasons.
                            this.notificationBannerService.showError(errorDetails);
                        }
                        break;
                    case 403:
                        // customer Id is not valid for current user
                        // may be a security attack
                        this.notificationBannerService.showError(errorDetails);
                        /*
                            will display a global error screen and will reload the app and refresh the user profile.
                         */
                        break;
                    default:

                        break;
                }
                break;
            default:
                this.notificationBannerService.showGenericError(error);
                break;
        }
    }

    private buildForm(): void {
        this.form = this.formBuilder.group({
            currency: [],
            requestedAmount: [],
            purpose: [],
            requestedDuration: ['', [Validators.required]],
            productType: []
        });
    }
}
