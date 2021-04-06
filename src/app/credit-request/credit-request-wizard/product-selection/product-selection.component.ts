import { Component, ViewContainerRef } from "@angular/core";
import { Observable } from "rxjs";
import { Page } from "tns-core-modules/ui/page/page";
import { localize } from "nativescript-localize";
import { AppColors, ProductRequestEvents } from "~/app/shared/constants";
import { ProductSelectionViewModel } from "../models/product-selection-view-model";
import { CreditRequestService } from "~/app/credit-request/services/credit-request.service";
import { map } from "rxjs/internal/operators";
import { ProductRequestFlowViewModel } from "~/app/credit-request/services/product-request-flow-view-model";
import { BottomSheetOptions } from "nativescript-material-bottomsheet/angular";
import {
    ProductCancelationReasonsModalComponent,
    ProductCancelationReasonsModalResult
} from "~/app/credit-request/components/product-cancelation-reasons-modal/product-cancelation-reasons-modal.component";
import { DialogResult } from "~/app/shared/app.enums";
import { RouterExtensions } from "nativescript-angular";
import { NotificationBannerService } from "~/app/shared/services";
import { MessagingService } from "~/app/core/services/messaging.service";
import { TopProgressModel } from "~/app/shared/components/top-progress/top-progress-model";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsProductRequestEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: "omro-product-selection",
    templateUrl: "./product-selection.component.html",
    styleUrls: ["./product-selection.component.scss"]
})
export class ProductSelectionComponent {
    private vm$: Observable<ProductSelectionViewModel>;
    private topProgressModel$: Observable<TopProgressModel>;
    monthFormatter = v => `${v} ${localize("Common.Months").toLowerCase()}`;
    AppColors = AppColors;

    constructor(
        page: Page,
        private creditRequestService: CreditRequestService,
        private vcRef: ViewContainerRef,
        private omroModalService: OmroModalService,
        private routerExtensions: RouterExtensions,
        private notificationBannerService: NotificationBannerService,
        private messagingService: MessagingService,
        private analyticsService: AnalyticsService
    ) {
        page.actionBarHidden = true;
        this.vm$ = creditRequestService.getCurrentProductRequest()
            .pipe(map(this.getProductSelectionViewModel));

        this.topProgressModel$ = creditRequestService.getCurrentProductRequest()
            .pipe(map(flow => new TopProgressModel({
                maxValue: flow.stages.length,
                progressValue: 1 + flow.stages.findIndex(stage => stage === flow.currentStage),
                showProgressValue: true
            })))
        
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductOfferOpen, this.routerExtensions.router.url);
    }

    public async onTapOk(vm: ProductSelectionViewModel) {
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductOfferAcceptSubmit, this.routerExtensions.router.url, 
            {
                acceptedAmount: vm.acceptedAmount,
                productOfferId: vm.productOfferId,
                aceptedDuration: vm.acceptedDuration
            }
        );
        const result = await this.creditRequestService.acceptOffer({
            acceptedAmount: vm.acceptedAmount,
            productOfferId: vm.productOfferId,
            aceptedDuration: vm.acceptedDuration
        });
        if (result) {
            this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductOfferAcceptOK, this.routerExtensions.router.url, result);
            this.messagingService.raiseEvent(ProductRequestEvents.ProductSelectionCompleted, {});
        } else {
            this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductOfferAcceptERROR, this.routerExtensions.router.url, result);
            this.notificationBannerService.showGenericError();
        }
    }

    public async onTapCancel(vm: ProductSelectionViewModel) {
        const reasons = await this.creditRequestService.productRequestCancelationReasons().toPromise();
        const options: BottomSheetOptions = {
            viewContainerRef: this.vcRef,
            transparent: true,
            context: reasons
        };
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductOfferRejectModalOpen, this.routerExtensions.router.url);
        this.omroModalService.showBottomSheet<ProductCancelationReasonsModalResult>(ProductCancelationReasonsModalComponent, options)
            .subscribe(result => {
                if (result && result.dialogResult === DialogResult.Yes) {
                    this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductOfferRejectSubmit, this.routerExtensions.router.url, result.selectedReasons);
                    setTimeout(() => this.cancelProductRequest(vm, result.selectedReasons), 50);
                }
                else if (result && result.dialogResult === DialogResult.No){
                    this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductOfferRejectModalClose, this.routerExtensions.router.url);
                }
            });
    }

    private getProductSelectionViewModel(productRequest: ProductRequestFlowViewModel) {
        const productSelection = productRequest.currentStage.stageDetails.productSelection;
        return new ProductSelectionViewModel({
            productRequestId: productRequest.productRequestSummary.productRequestId,
            productOfferId: productSelection.productOfferId,
            stage: productRequest.currentStage,
            acceptedAmount: productSelection.initialProposedAmount,
            acceptedDuration: productSelection.initialProposedPeriod,
            currencyDisplayName: productRequest.productRequestSummary.currencyDislayName,
        });
    }

    private async cancelProductRequest(vm: ProductSelectionViewModel, selectedReasons: string[]) {
        const result = await this.creditRequestService.cancelProductRequest(selectedReasons);
        if (!result) {
            this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductOfferRejectERROR, this.routerExtensions.router.url, result);
            this.notificationBannerService.showGenericError();
        }
        else {
            this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductOfferRejectOK, this.routerExtensions.router.url, result);
        }
    }

    public goBack() {
        this.routerExtensions.backToPreviousPage();
    }
}
