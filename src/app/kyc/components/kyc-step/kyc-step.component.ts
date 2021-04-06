import { Component, HostListener, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { InfoPageModel } from "~/app/shared/components/informative-page/info-page-model";
import { KycService } from "~/app/kyc/services/kyc.service";
import { UserKYCUrlOutputModel } from "~/app/kyc/models/userKYCUrlOutputModel";
import { KYCUrlType } from "~/app/kyc/models/kYCUrlType";
import { traceDebug } from "~/app/core/logging/logging-utils";
import { combineLatest, merge, Observable, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/internal/operators";
import { Page } from "tns-core-modules/ui/page/page";
import { BackButtonHandlerService } from "~/app/kyc/services/back-button-handler.service";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { localize } from "nativescript-localize";
import { DialogResult } from "~/app/shared/app.enums";
import { BaseComponent } from "~/app/shared/base.component";
import { MessagingService } from "~/app/core/services/messaging.service";
import { BottomDialogButtonType } from "~/app/shared/models/bottom-dialog.config";
import { CreditRequestService } from '~/app/credit-request/services/credit-request.service';
import * as utils from "tns-core-modules/utils/utils";
import { APP_CONFIG } from "../../../core/environment";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsProductRequestEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: 'omro-kyc-explanation',
    templateUrl: './kyc-step.component.html',
    styleUrls: ['./kyc-step.component.scss']
})
export class KycStepComponent extends BaseComponent implements OnInit, OnDestroy {
    private pageModel: UserKYCUrlOutputModel;
    private navigateAway: Subject<any> = new Subject();
    private sessionId: string;

    public vm: InfoPageModel = {};
    public unsubscribe$: Subject<any> = new Subject<any>();

    constructor(private kycService: KycService,
                public routerExtensions: RouterExtensions,
                private page: Page,
                private backButtonHandler: BackButtonHandlerService,
                private confirmationDialogService: OmroModalService,
                private vcRef: ViewContainerRef,
                private messagingService: MessagingService,
                private creditRequestService: CreditRequestService,
                private analyticsService: AnalyticsService
                ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
        this.page.enableSwipeBackNavigation = false;
    }

    @HostListener("loaded")
    public pageInit(): void {
        this.backButtonHandler.registerBackButtonHandler();

        this.backButtonHandler.backPressed
            .pipe(takeUntil(merge(this.unsubscribe$, this.navigateAway)))
            .subscribe(() => this.onGoBack());
    }

    public async ngOnInit(): Promise<void> {
        // await this.kycService.initKyc().pipe(take(1)).toPromise().then(value => {
        //     this.analyticsService.trackEvent(AppInsightsProductRequestEvents.KYCRedirectStart, this.routerExtensions.router.url, value);
        //     this.sessionId = value.sessionId;
        // });

        // traceDebug("redirect url " + APP_CONFIG.independentKYCBaseUrl + "filbo-mobile-redirect?redirect=" + APP_CONFIG.omroProtocol + "kyc/kyc-redirect-finish" + "&providerSessionId=" + this.sessionId + "&steps=ExternalKycProvider");
        // utils.openUrl(APP_CONFIG.independentKYCBaseUrl + "filbo-mobile-redirect?redirect=" + APP_CONFIG.omroProtocol + "kyc/kyc-redirect-finish" + "&providerSessionId=" + this.sessionId + "&steps=ExternalKycProvider");
        // this.redirectToSource();

        if (!this.kycService.initialized) {
            traceDebug('INIT KYC');

            this.messagingService.getState<any>('kyc-state')
                .pipe(take(1))
                .subscribe((value: { source: any }) => {
                    this.kycService.source = value.source;
                    traceDebug('Source is: ' + this.kycService.source);
                });

            await this.kycService.initKyc().pipe(take(1)).toPromise().then(value => {
                traceDebug(JSON.stringify(value));
                this.sessionId = value.sessionId;
            });
        }

        combineLatest([this.kycService.currentStep(), this.kycService.finished])
        .pipe(take(1))
        .subscribe(([value, finished]) => {
            if (finished) {
                this.kycService.userCompletedKyc(this.creditRequestService.currentProductRequestId, this.kycService.sessiodId);
                this.fadeNavigate('kyc/kyc-finish');
                return;
            }
            this.pageModel = value;
            traceDebug('Read KYC step: ' + JSON.stringify(this.pageModel));
            if (this.pageModel) {
                this.vm.title = this.pageModel.title;
                this.vm.description = this.pageModel.details;
                this.vm.imageSource = this.getImageByStepType(this.pageModel.type);
                this.vm.actionButtonText = this.pageModel.buttonText;
            }
            this.onActionButtonTapped();
        });

        // if (android.os.Build.VERSION.SDK_INT <= 28){
        //     combineLatest([this.kycService.currentStep(), this.kycService.finished])
        //         .pipe(take(1))
        //         .subscribe(([value, finished]) => {
        //             if (finished) {
        //                 this.kycService.userCompletedKyc(this.creditRequestService.currentProductRequestId, this.kycService.sessiodId);
        //                 this.fadeNavigate('kyc/kyc-finish');
        //                 return;
        //             }
        //             this.pageModel = value;
        //             traceDebug('Read KYC step: ' + JSON.stringify(this.pageModel));
        //             if (this.pageModel) {
        //                 this.vm.title = this.pageModel.title;
        //                 this.vm.description = this.pageModel.details;
        //                 this.vm.imageSource = this.getImageByStepType(this.pageModel.type);
        //                 this.vm.actionButtonText = this.pageModel.buttonText;
        //             }
        //             this.onActionButtonTapped();
        //         });
        // }
        // else{
        //     traceDebug("redirect url " + APP_CONFIG.independentKYCBaseUrl + "filbo-mobile-redirect?redirect=" + APP_CONFIG.omroProtocol + "kyc/kyc-redirect-finish" + "&providerSessionId=" + this.sessionId + "&steps=ExternalKycProvider");
        //     utils.openUrl(APP_CONFIG.independentKYCBaseUrl + "filbo-mobile-redirect?redirect=" + APP_CONFIG.omroProtocol + "kyc/kyc-redirect-finish" + "&providerSessionId=" + this.sessionId + "&steps=ExternalKycProvider");
        //     this.redirectToSource();
        // }
    }

    public async onPageClosed(): Promise<void> {
        const confirmed = await this.exitProcessWithConfirmation();
        if (confirmed) {
            this.reset();
            this.redirectToSource();
        }
    }

    public onActionButtonTapped() {
        this.fadeNavigate('kyc/kyc-execution');
    }

    public onGoBack() {
        this.kycService.canGoBack
            .pipe(take(1))
            .subscribe(async ok => {
                if (ok) {
                    this.routerExtensions.backToPreviousPage();
                    this.kycService.goBack();
                } else {
                    const confirmed = await this.exitProcessWithConfirmation();
                    if (confirmed) {
                        this.reset();
                        this.routerExtensions.backToPreviousPage();
                    }
                }
            });
    }

    private reset(): void {
        this.backButtonHandler.disableBackHandler();
        this.kycService.reset();
    }

    private getImageByStepType(type: KYCUrlType): string {
        return '~/app/images/new_loan_resolution_manual.svg';
    }

    private fadeNavigate(path: string): void {
        this.navigateAway.next(true);
        this.routerExtensions.navigate([path], {
            transition: {
                name: "fade"
            }
        });
    }

    private exitProcessWithConfirmation(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.confirmExitKycProcess()
                .pipe(take(1))
                .subscribe(res => {
                    if (res === DialogResult.Yes) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
        });
    }

    private confirmExitKycProcess(): Observable<DialogResult> {
        return this.confirmationDialogService.showYesNoDialog(
            {
                viewContainerRef: this.vcRef,
                title: localize('Common.AreYouSure'),
                message: localize('KYC.Label_ConfirmLeaveKycProcess'),
                yesButtonType: BottomDialogButtonType.Error
            }
        );
    }

    private redirectToSource(): void {
        const redirectUrl = this.kycService.sourceUrl;
        this.routerExtensions.navigate(['/dashboard', {outlets: {dashboard: [redirectUrl]}}], {
            transition: {
                name: "fade"
            }
        });
    }
}
