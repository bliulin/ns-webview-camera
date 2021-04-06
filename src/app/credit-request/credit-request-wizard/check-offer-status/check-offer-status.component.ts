import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";
import { RadialBarIndicator } from "nativescript-ui-gauge";
import { Subject, timer } from "rxjs";
import { switchMap, take, takeUntil } from "rxjs/operators";
import { RouterExtensions } from "nativescript-angular";
import { OfferState } from "../../models/types";
import { CreditRequestService } from "~/app/credit-request/services/credit-request.service";
import { ProductRequestFlowViewModel } from "~/app/credit-request/services/product-request-flow-view-model";
import { MessagingService } from "~/app/core/services/messaging.service";
import { ProductRequestEvents } from "~/app/shared/constants";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsProductRequestEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: "omro-check-offer-status",
    templateUrl: "./check-offer-status.component.html",
    styleUrls: ["./check-offer-status.component.scss"]
})
export class CheckOfferStatusComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild("indicator", {static: false}) private indicator: ElementRef;

    public barIndicator: RadialBarIndicator;
    public offerState: OfferState;

    public time: number = 0;
    private unsubscribe$: Subject<any> = new Subject<any>();
    private productRequest: ProductRequestFlowViewModel;

    constructor(
        private page: Page,
        private routerExtensions: RouterExtensions,
        private service: CreditRequestService,
        private messagingService: MessagingService,
        private analyticsService: AnalyticsService
    ) {
        this.page.actionBarHidden = true;
        this.offerState = "InProgress";
    }

    public ngOnInit(): void {
        this.service
            .getCurrentProductRequest()
            .pipe(take(1))
            .subscribe(productRequest => {
                this.productRequest = productRequest;
                this.initTimer();
            });
        
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.CheckOfferStatusOpen, this.routerExtensions.router.url);
    }

    public get isInProgressOrFinished(): boolean {
        return this.offerState === "InProgress" || this.offerState === "Finished";
    }

    public get needsManualApproval(): boolean {
        return this.offerState === "NeedsManualApproval";
    }

    public ngAfterViewInit(): void {
        this.barIndicator = this.indicator.nativeElement as RadialBarIndicator;
    }

    private initTimer() {
        const productRequestId = this.productRequest.productRequestSummary.productRequestId;
        timer(100).subscribe(() => this.incrementBar());
        timer(5000, 5000)
            .pipe(switchMap(() => this.service.checkOfferStatus(productRequestId)))
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                response => {
                    this.offerState = response;
                    this.analyticsService.trackEvent(AppInsightsProductRequestEvents.CheckOfferStatusOK, this.routerExtensions.router.url, response);
                    if (this.offerState !== "InProgress") {
                        this.done();
                    }
                    if (this.offerState === "Finished") {
                        this.messagingService.raiseEvent(ProductRequestEvents.CheckOfferStatusCompleted, null);
                    }
                    this.incrementBar();
                },
                error => {
                    this.analyticsService.trackEvent(AppInsightsProductRequestEvents.CheckOfferStatusERROR, this.routerExtensions.router.url, error);
                }
            );
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    public done(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    public goBack(): void {
        this.routerExtensions.backToPreviousPage();
    }

    private incrementBar(): void {
        this.time++;
        this.barIndicator.maximum += 20;
    }

    private redirectToHome(): void {
        this.routerExtensions.navigate(["dashboard", {outlets: {dashboard: ["home"]}}], {
            transition: {
                name: "fade"
            },
            clearHistory: true
        });
    }
}
