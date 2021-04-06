import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from "@angular/core";
import { localize } from "nativescript-localize";
import { DialogResult } from "~/app/shared/app.enums";
import { RouterExtensions } from "nativescript-angular";
import { NotificationBannerService } from "~/app/shared/services";
import { CreditRequestService } from "~/app/credit-request/services/credit-request.service";
import { ProductRequestFlowViewModel } from "~/app/credit-request/services/product-request-flow-view-model";
import { ProductRequestFlowStageOutputModel } from "~/app/credit-request/models/productRequestFlowStageOutputModel";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { filter } from "rxjs/internal/operators/filter";
import { catchError, switchMap, take } from "rxjs/internal/operators";
import { throwError } from "rxjs";
import { MessagingService } from "~/app/core/services/messaging.service";
import { CreditRequestControllerService } from "~/app/credit-request/services/credit-request-controller.service";
import {
    BottomDialogButtonType,
    BottomDialogConfig,
    Orientation
} from "~/app/shared/models/bottom-dialog.config";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsDashboardEvents, AppInsightsProductRequestEvents } from "~/app/core/models/app-insights-events";

export enum CreditOverviewMenuAction {
    DeleteFile
}

@Component({
    selector: "omro-credit-overview",
    templateUrl: "./credit-overview.component.html",
    styleUrls: ["./credit-overview.component.scss"]
})
export class CreditOverviewComponent implements OnInit {
    creditOverviewMenuConfig: BottomDialogConfig<CreditOverviewMenuAction>;
    deleteConfirmationMenuConfig: BottomDialogConfig<DialogResult>;
    @Input() private product: ProductRequestFlowViewModel;
    @Output() public productRequestCancelled: EventEmitter<any> = new EventEmitter();

    constructor(
        private creditRequestService: CreditRequestService,
        private vcRef: ViewContainerRef,
        private routerExtensions: RouterExtensions,
        private notificationBannerService: NotificationBannerService,
        private dialogService: OmroModalService,
        private messagingService: MessagingService,
        private creditRequestControllerService: CreditRequestControllerService,
        private analyticsService: AnalyticsService
    ) {
        this.initDialogConfigs();

    }

    get currentStage(): ProductRequestFlowStageOutputModel {
        return this.product.currentStage;
    }

    get productSummary() {
        return this.product.productRequestSummary || {};
    }

    get displayProductRequestState(): string {
        return localize(
            `CreditRequest.Overview.ProductRequestState.${this.productSummary.state}`
        );
    }

    get duration() {
        return (
            this.productSummary.acceptedDuration |
            this.productSummary.requestedDuration
        );
    }

    public async ngOnInit(): Promise<void> {
    }

    async onTapElipsis() {
        this.dialogService.showBottomDialog(this.creditOverviewMenuConfig)
            .subscribe(dialogResult => {
                if (dialogResult === CreditOverviewMenuAction.DeleteFile) {
                    this.analyticsService.trackEvent(AppInsightsDashboardEvents.DashboardProductRequestCancel, this.routerExtensions.router.url);
                    setTimeout(() => this.cancelProductRequest(), 500);
                }
            });
    }

    public onTapActionButton(): void {
        this.analyticsService.trackEvent(AppInsightsDashboardEvents.DashboardProductRequestContinue, this.routerExtensions.router.url);
        this.creditRequestControllerService.showCurrentStage();
    }

    private async cancelProductRequest() {
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductRequestRejectSubmit, this.routerExtensions.router.url);
        this.dialogService.showBottomDialog(this.deleteConfirmationMenuConfig)
            .pipe(filter(r => r === DialogResult.Yes))
            .pipe(switchMap(() => this.creditRequestService.cancelProductRequest()))
            .pipe(take(1))
            .pipe(catchError(err => {
                this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductRequestRejectERROR, this.routerExtensions.router.url, err);
                this.notificationBannerService.showGenericError();
                return throwError(err);
            }))
            .subscribe((response) => {
                this.analyticsService.trackEvent(AppInsightsProductRequestEvents.ProductRequestRejectOK, this.routerExtensions.router.url, response);
                this.productRequestCancelled.emit();
            });
    }

    private initDialogConfigs() {
        this.creditOverviewMenuConfig = {
            viewContainerRef: this.vcRef,
            title: localize('Common.Actions'),
            orientation: Orientation.Vertical,
            actions: [
                {
                    buttonType: BottomDialogButtonType.Error,
                    text: localize('CreditRequest.Overview.DeleteFile'),
                    result: CreditOverviewMenuAction.DeleteFile
                }
            ]
        };

        this.deleteConfirmationMenuConfig = {
            viewContainerRef: this.vcRef,
            title: localize('CreditRequest.Overview.AreYouSure'),
            message: localize('CreditRequest.Overview.AreYouSureYouWantToDelete'),
            actions: [
                {
                    buttonType: BottomDialogButtonType.Error,
                    text: localize('CreditRequest.Overview.YesDelete'),
                    result: DialogResult.Yes
                },
                {
                    buttonType: BottomDialogButtonType.Transparent,
                    text: localize('Common.No'),
                    result: DialogResult.No
                }
            ]
        };
    }
}
