import { Component, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { AppEvents } from "../../shared/constants";
import { AppStatusResponse } from "../../startup/app-status-response";
import { MessagingService } from "../../core/services/messaging.service";
import { ModalDialogService, RouterExtensions } from "nativescript-angular";
import { TermsAndConditionsModalComponent } from "../../shared/components";
import { TermsAndConditionsModel } from "../../shared/models";
import { AuthenticationService } from "../../core/authentication/authentication.service";
import { traceDebug } from "../../core/logging/logging-utils";
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from "../../core/environment";
import { UnlockService } from "~/app/core/services/unlock.service";
import { Page } from "tns-core-modules/ui/page/page";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/internal/operators";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { DialogResult } from "~/app/shared/app.enums";
import { UserAction } from "~/app/profile/models";
import {
    BottomDialogButtonType,
    Orientation
} from "~/app/shared/models/bottom-dialog.config";

@Component({
    selector: "omro-dev-links",
    templateUrl: "./dev-links.component.html",
    styleUrls: ["./dev-links.component.scss"]
})
export class DevLinksComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<any> = new Subject();
    public homeNumber: string = '100A';
    private Orientation: typeof Orientation = Orientation;

    constructor(
        private messagingService: MessagingService,
        private authService: AuthenticationService,
        private vcRef: ViewContainerRef,
        private unlockService: UnlockService,
        private httpClient: HttpClient,
        private routerExtensions: RouterExtensions,
        private page: Page,
        private dialogService: OmroModalService) {
        page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.messagingService.getEvent(AppEvents.TermsAndConditionsOpened)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(async (payload: AppStatusResponse) => {
                const response: boolean = await this.showTermsAndConditions({
                    confirmationMode: true,
                    model: <TermsAndConditionsModel>{
                        content: payload.tacContent,
                        version: payload.tacVersion,
                        lastUpdate: new Date(payload.tacLastUpdatedDate)
                    } as TermsAndConditionsModel
                });
                this.messagingService.raiseEvent(AppEvents.TermsAndConditionsClosed, response);
            });
    }

    public ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    public onDrawerButtonTap(): void {
    }

    public onLogout(): void {
        this.redirectTo('login/logout');
    }

    public onTestPrivateApi(): void {
        const url = APP_CONFIG.baseUrl + 'Private/registrationcompanyinfo';
        this.httpClient.get(url)
            .subscribe(
                response => {
                    alert('Request success!');
                    traceDebug(JSON.stringify(response));
                },
                error => {
                    alert('Request failed');
                    traceDebug("Error: " + JSON.stringify(error));
                });
    }

    protected getScreenName(): string {
        return "Feedback";
    }

    private showTermsAndConditions(context?: any): Promise<boolean> {
        const options = {
            context: context || {},
            fullscreen: true,
            viewContainerRef: this.vcRef,
            animated: true
        };

        return <Promise<boolean>>this.dialogService.showModal(TermsAndConditionsModalComponent, options);
    }

    private lock(): void {
        this.unlockService.lock();
        //this.routerExtensions.navigateByUrl('lock', {clearHistory: true});
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate([path], {
            transition: {
                name: "fade"
            },
            clearHistory: true
        });
    }

    onTapCreditOverview() {
        this.routerExtensions.navigate(['dashboard', {outlets: {dashboard: 'home/credit-overview'}}]);
    }

    public onConfirmationDialog() {
        this.dialogService.showBottomDialog(
            {
                viewContainerRef: this.vcRef,
                title: "Esti sigur?",
                message: "Esti sigur ca vrei sa-ti resetezi parola?",
                actions: [
                    {
                        buttonType: BottomDialogButtonType.Error,
                        text: "Da, reseteaza",
                        result: DialogResult.Yes
                    },
                    {
                        buttonType: BottomDialogButtonType.Transparent,
                        text: "Nu",
                        result: DialogResult.No
                    }
                ]
            }
        ).subscribe(res => {
            console.log("Confirmation dialog result = ", res);
        });
    }

    public onConfirmationDialogVertical() {
        this.dialogService.showBottomDialog(
            {
                viewContainerRef: this.vcRef,
                title: "Actiuni",
                orientation: Orientation.Vertical,
                actions: [
                    {
                        buttonType: BottomDialogButtonType.Secondary,
                        text: "Alege companie activa",
                        result: UserAction.SetActive
                    },
                    {
                        buttonType: BottomDialogButtonType.Secondary,
                        text: "Detalii companie",
                        result: UserAction.Details
                    },
                    {
                        buttonType: BottomDialogButtonType.Error,
                        text: "Sterge companie",
                        result: UserAction.Delete
                    }
                ]
            }
        ).subscribe(res => {
            console.log("Confirmation dialog result = ", res);
        });
    }
}
