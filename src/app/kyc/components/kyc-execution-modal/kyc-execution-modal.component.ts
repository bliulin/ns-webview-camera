import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { KycService } from "~/app/kyc/services/kyc.service";
import { RouterExtensions } from 'nativescript-angular';
import { BackButtonHandlerService } from "~/app/kyc/services/back-button-handler.service";
import { WebView } from 'tns-core-modules/ui/web-view';
import { WebViewInterface } from "nativescript-webview-interface";
import { filter, take } from "rxjs/internal/operators";
import { traceDebug } from "~/app/core/logging/logging-utils";
import { BehaviorSubject, Observable } from "rxjs";
import { Page } from "tns-core-modules/ui/page/page";
import { BaseComponent } from "~/app/shared/base.component";
import { isAndroid } from "tns-core-modules/platform";
import { KycExecutionPermissions } from "./kyc-execution-permissions.android";
import { DialogResult } from "~/app/shared/app.enums";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { localize } from "nativescript-localize";
import { BottomDialogButtonType } from "~/app/shared/models/bottom-dialog.config";
const permissions = require("nativescript-permissions");

@Component({
    selector: 'omro-kyc-execution',
    templateUrl: './kyc-execution-modal.component.html',
    styleUrls: ['./kyc-execution-modal.component.scss']
})
export class KycExecutionModalComponent extends BaseComponent implements OnInit {

    private messageWebViewInterface: any;
    private oLangWebViewInterface: WebViewInterface;
    private url$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    public title: string;

    @ViewChild("webView", { static: true })
    // tslint:disable-next-line: member-access
    public myWebView: ElementRef;

    private dummy_url = 'https://bliulinstorage.z6.web.core.windows.net/';

    constructor(private kycService: KycService,
        public routerExtensions: RouterExtensions,
        private backButtonHandler: BackButtonHandlerService,
        private page: Page,
        private confirmationDialogService: OmroModalService,
        private vcRef: ViewContainerRef) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
        this.backButtonHandler.supressBackButton();
    }

    @HostListener("loaded")
    public pageInit(): void {
        this.backButtonHandler.disableBackHandler();
    }

    ngOnInit() {
        this.kycService.currentStep()
            .pipe(take(1))
            .subscribe(model => {
                this.url$.next(model.url);
                this.url$.next(this.dummy_url);
                //this.title = model.title;
            });
    }

    ngOnDestroy() {
        if (this.messageWebViewInterface) {
            this.messageWebViewInterface.destroy();
            this.messageWebViewInterface = null;
        }
    }

    public redirectToNextStep(): void {
        this.kycService.advance();
        this.slideLeftNavigate('kyc/kyc-step');
    }

    public onWebViewLoaded(): void {
        traceDebug('Loaded webview');
        this.url$
            .pipe(filter(url => !!url))
            .subscribe(url => this.setupWebViewInterface(url));
    }

    public async goBack(): Promise<void> {
        const confirmed = await this.exitProcessWithConfirmation();
        if (confirmed) {
            this.backButtonHandler.disableBackHandler();
            this.kycService.reset();
            this.redirectToSource();
        }
    }

    private setupWebViewInterface(url: string): void {
        const webView: WebView = this.myWebView.nativeElement;
        if (isAndroid) {
            const settings = webView.android.getSettings();
            settings.setDomStorageEnabled(true);
            settings.setJavaScriptEnabled(true);
            settings.setSupportZoom(false);
            settings.allowFileAccess = true;
            settings.allowContentAccess = true;
            settings.setAllowFileAccessFromFileURLs(true);
            settings.setAllowUniversalAccessFromFileURLs(true);

            webView.android.setWebViewClient(new android.webkit.WebViewClient());

            // webView.on(WebViewExt.requestPermissionsEvent, (args) => {

            // });

            // webView.on(WebViewExt.requestPermissionsEvent, (args: RequestPermissionsEventData) => {
            //     const wantedPerssions = args.permissions
            //         .map((p) => {
            //             if (p === "RECORD_AUDIO") {
            //                 return android.Manifest.permission.RECORD_AUDIO;
            //             }

            //             if (p === "CAMERA") {
            //                 return android.Manifest.permission.CAMERA;
            //             }

            //             return p;
            //         })
            //         .filter((p) => !!p);

            //     permissions
            //         .requestPermissions(wantedPerssions)
            //         .then(() => args.callback(true))
            //         .catch(() => args.callback(false));
            //  });

            permissions.requestPermissions([android.Manifest.permission.CAMERA], "").then(() => {
                traceDebug('Permissions granted');
                webView.android.setWebChromeClient(new KycExecutionPermissions());
                webView.reload();
            })
            .catch(() => {
                traceDebug('No permissions granted');
            });
        }
        this.oLangWebViewInterface = new WebViewInterface(webView, url);
        this.listenToActions();
    }

    private listenToActions(): void {
        this.oLangWebViewInterface.on("action", (event) => {
            traceDebug('Received event: ' + JSON.stringify(event));
            if (event.origin === "https://test-kyc.filbo.ro/"){
                this.redirectToNextStep();
            }
        });
    }

    private slideLeftNavigate(path: string): void {
        super.redirectTo(path);
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
