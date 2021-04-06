import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { UiService } from '~/app/credit-request/services/ui.service';
import { Observable, throwError, combineLatest } from 'rxjs';
import { UIOutputModel } from '~/app/credit-request/models/uIOutputModel';
import { catchError, map, mapTo, retryWhen, switchMap, tap } from 'rxjs/internal/operators';
import { CreditRequestService } from '~/app/credit-request/services/credit-request.service';
import { EligibleProductOutputModel } from '~/app/credit-request/models/eligibleProductOutputModel';

import { of } from 'rxjs/internal/observable/of';
import { NotificationBannerService } from '~/app/shared/services';
import { RouterExtensions } from 'nativescript-angular';
import { ProductRequestFlowOutputModel } from '~/app/credit-request/models/productRequestFlowOutputModel';
import { LoansModuleLoan } from '../../models/loansModuleLoan';
import { DashboardModuleType } from '../../models/dashboardModuleType'

import { BottomSheetOptions } from 'nativescript-material-bottomsheet/angular';
import { SwitchCurrentLoanComponent } from '../components/switch-current-loan/switch-current-loan.component';
import { LoanSelection } from '../components/switch-current-loan/loan-selection.model';
import { Page } from 'tns-core-modules/ui/page/page';
import { CreditRequestControllerService } from "~/app/credit-request/services/credit-request-controller.service";
import { BaseComponent } from "~/app/shared/base.component";
import { ApplicationService } from "~/app/core/services/application.service";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsDashboardEvents } from "~/app/core/models/app-insights-events";

interface UiState {
    newLoadCard: boolean;
    eligibleStandardProductCard: boolean;
    singleRequest: boolean;
    multipleRequests: boolean;
    activeLoanCard: boolean;
}

@Component({
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent extends BaseComponent implements OnInit, OnDestroy {
    public ui$: Observable<UIOutputModel>;
    public state$: Observable<UiState>;
    public loaded$: Observable<boolean>;

    constructor(
        private page: Page,
        private service: UiService,
        private creditRequestService: CreditRequestService,
        private notificationService: NotificationBannerService,
        routerExtensions: RouterExtensions,
        private omroModalService: OmroModalService,
        private containerRef: ViewContainerRef,
        private creditRequestControllerService: CreditRequestControllerService,
        application: ApplicationService,
        private analyticsService: AnalyticsService
    ) {
        super(routerExtensions, application);
        this.analyticsService.trackEvent(AppInsightsDashboardEvents.DashboardOpen, this.routerExtensions.router.url);
        this.page.actionBarHidden = true;
        this.ui$ = service.ui$
            .pipe(tap( response => this.analyticsService.trackEvent(AppInsightsDashboardEvents.DashboardOK, this.routerExtensions.router.url, response)))
            .pipe(catchError((err) => this.handleError(err)))
            .pipe(retryWhen(this.getNoConnectivityRetryStrategy()));

        this.state$ = this.ui$.pipe(map(this.getState));
        this.loaded$ = this.state$
            .pipe(
                switchMap(s => {
                    return s.singleRequest ? this.singleRequestInProgress$ : of(true);
                })
            )
            .pipe(mapTo(true));
    }

    public ngOnInit(): void {
        this.service.invalidateCache();
        this.creditRequestService.invalidateCache();
    }

    public get loans$(): Observable<LoansModuleLoan[]> {
        return this.service.loans$;
    }

    public get currentActivitiesList$(): Observable<any> {
        return this.service.currentActivitiesList$;
    }

    public get singleRequestInProgress$(): Observable<ProductRequestFlowOutputModel> {
        return this.creditRequestService.getCurrentProductRequest();
    }

    public get eligibleStandardProduct$(): Observable<EligibleProductOutputModel> {
        return this.service.eligibleStandardProduct$;
    }

    public get currentLoan$(): Observable<LoansModuleLoan> {
        return this.service.currentLoan$;
    }

    public onNewLoanTap(): void {
        this.analyticsService.trackEvent(AppInsightsDashboardEvents.DashboardProductRequestNew, this.routerExtensions.router.url)
        this.creditRequestControllerService.initiateProductRequest();
    }

    public onCreditTap(productRequestId: string): void {
        this.analyticsService.trackEvent(AppInsightsDashboardEvents.DashboardProductRequestContinue, this.routerExtensions.router.url)
        this.routerExtensions.navigate(['credit-request/credit-overview', productRequestId]);
    }

    public onSwitchLoanTap(): void {
        this.openSwitchCurrentLoanBottomSheet();
    }

    private openSwitchCurrentLoanBottomSheet(): void {
        const options: BottomSheetOptions = {
            viewContainerRef: this.containerRef,
            context: this.getLoansMappedToLoanSelectionModel$(),
            transparent: true
        };

        this.omroModalService.showBottomSheet(SwitchCurrentLoanComponent, options);
    }

    private getLoansMappedToLoanSelectionModel$(): Observable<LoanSelection[]> {
        return combineLatest([this.service.loans$, this.service.currentLoan$]).pipe(
            map(([loans, currentLoan]) =>
                loans.map(
                    loan =>
                        ({
                            id: loan.loanId,
                            iconHint: loan.iconHint,
                            //purpose: loan.purpose,
                            totalAmount: loan.totalAmount,
                            currencyDisplayName: loan.currencyDisplayName,
                            iconColor: loan.color,
                            isSelected: true ? loan.loanId === currentLoan.loanId : false
                        } as LoanSelection)
                )
            )
        );
    }

    private getState(ui: UIOutputModel): UiState {
        const nrOfReqInProgress = ui.requestsInProgress ? ui.requestsInProgress.length : 0;
        const eligibleProducts = ui.eligibleProducts && ui.eligibleProducts.length > 0;
        const dashboardModules = ui.dashboardModules && ui.dashboardModules.find(m => m.moduleType === 'LoansModule' as DashboardModuleType).loans && ui.dashboardModules.find(m => m.moduleType === 'LoansModule' as DashboardModuleType).loans.length > 0;
        return <UiState>{
            newLoadCard: eligibleProducts && (nrOfReqInProgress > 0 || dashboardModules),
            eligibleStandardProductCard: eligibleProducts && nrOfReqInProgress === 0 && !dashboardModules,
            multipleRequests: nrOfReqInProgress > 1 || dashboardModules,
            singleRequest: nrOfReqInProgress === 1 && !dashboardModules,
            activeLoanCard: dashboardModules
        };
    }

    private handleError(err: any): Observable<never> {
        this.analyticsService.trackEvent(AppInsightsDashboardEvents.DashboardERROR, this.routerExtensions.router.url, err);
        this.notificationService.showGenericError(err);
        return throwError(err);
    }

    private onProductRequestCancelled() {
        this.service.reload();
    }
}
