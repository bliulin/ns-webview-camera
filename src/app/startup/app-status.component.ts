import { Component, OnInit, EventEmitter, OnDestroy, Output } from "@angular/core";
import { AppStatusHttpService } from "./app-status-http.service";
import { GlobalState } from "../shared/global-state";
import { AppEvents, AppStatus} from "../shared/constants";
import { Guid } from "guid-typescript";

import * as appSettings from "tns-core-modules/application-settings";
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { AppStatusResponse } from "./app-status-response";
import { AuthenticationService } from "../core/authentication/authentication.service";
import { MessagingService } from "../core/services/messaging.service";
import { traceDebug, traceError } from "../core/logging/logging-utils";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/internal/operators";
import { OmroSessionService } from "~/app/core/services/omro-session.service";

@Component({
    selector: "omro-app-status",
    template: ""
})
export class AppStatusComponent implements OnInit, OnDestroy {

    private unsubscribe$: Subject<any> = new Subject();

    public appStatusHandled: EventEmitter<any> = new EventEmitter();

    @Output()
    public appStatusError: EventEmitter<number> = new EventEmitter();

    public constructor(
        private router: Router, private routerExtensions: RouterExtensions,
        private appStatusService: AppStatusHttpService,
        private authService: AuthenticationService,
        private messagingService: MessagingService,
        private sessionService: OmroSessionService) {
    }

    public async ngOnInit(): Promise<void> {
        try {
            await this.handleAppLaunch();
        } catch (error) {
            console.error('Failed to handle application launch. Error message: ' + JSON.stringify(error));
        } finally {
            this.appStatusHandled.emit();
        }
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    private async handleAppLaunch(): Promise<void> {
        if (!this.sessionService.hasSession) {
            traceDebug("First application launch...");
            await this.handleFirstAppRun();
            return;
        }

        const sessionId = this.sessionService.sessionId;
        traceDebug("Current Session ID: " + sessionId);
        const response = await this.getAppStatusResponse(sessionId);
        if (!response) {
            return;
        }

        const isLoggedIn = this.authService.isLoggedIn();
        let storedSettings = false;
        if (isLoggedIn) {
            storedSettings = await this.handleTermsAndConditionsChanged(response);
        }

        if (!storedSettings) {
            appSettings.setString(AppStatus.MarketingAccord, response.marketingAccord);
        }
    }

    private handleTermsAndConditionsChanged(response: AppStatusResponse): Promise<boolean> {
        return new Promise((resolve, reject) => {
            let tacVersion = -1;
            // Check if the key was not removed from storage first
            if (appSettings.hasKey(AppStatus.TaCVersion)) {
                tacVersion = appSettings.getNumber(AppStatus.TaCVersion);
            }

            traceDebug("Current TAC version: " + tacVersion);
            traceDebug("Server TAC version: " + response.tacVersion);

            if (response.tacVersion !== tacVersion) {
                this.messagingService.getState(AppEvents.TermsAndConditionsClosed)
                    .pipe(takeUntil(this.unsubscribe$))
                    .subscribe(
                    (acceptedTC: boolean) => {
                        if (acceptedTC) {
                            this.storeSettings(response);
                        }
                        resolve(acceptedTC);
                    });
                this.messagingService.raiseEvent(AppEvents.TermsAndConditionsOpened, response);
            } else {
                resolve(false);
            }
        });
    }

    private async handleFirstAppRun(): Promise<void> {
        GlobalState.isFirstRun = true;
        const sessionId = this.sessionService.sessionId;
        const response = await this.getAppStatusResponse(sessionId);
        if (response) {
            if (response.sessionId !== sessionId) {
                traceError('App status check returned a different session ID!');
            }
            this.storeSettings(response);
        }
    }

    private storeSettings(response: AppStatusResponse): void {
        appSettings.setNumber(AppStatus.TaCVersion, response.tacVersion);
        appSettings.setString(AppStatus.TaCContent, response.tacContent);
        appSettings.setString(AppStatus.TaCLastUpdate, response.tacLastUpdatedDate);
        appSettings.setString(AppStatus.MarketingAccord, response.marketingAccord);
        traceDebug('Stored app settings: ' + JSON.stringify(response));
    }

    private async getAppStatusResponse(sessionId: string): Promise<AppStatusResponse> {
        let response: AppStatusResponse = null;
        try {
            response = await this.appStatusService.getAppStatusResponse(sessionId).toPromise();
            traceDebug('AppStatus response: ' + JSON.stringify(response));
        } catch (error) {
            traceDebug("Error from app status: " + JSON.stringify(error));
            this.raiseBusinessErrorEvent(error);
        }
        return response;
    }

    private raiseBusinessErrorEvent(error: any): void {
        if (!error || error.status !== 400) {
            return;
        }

        if (!error.error) {
            traceError('Missing "error" field in server message!');
            return;
        }

        const businessError = error.error;
        this.appStatusError.emit(businessError.status);
    }
}
