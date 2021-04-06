import { Injectable } from '@angular/core';
import { AppSettingsService } from "~/app/core/services/app-settings.service";
import { Guid } from "guid-typescript";
import { AppStatus } from "~/app/shared/constants";
import { traceDebug } from "~/app/core/logging/logging-utils";

@Injectable({
    providedIn: 'root'
})
export class OmroSessionService {

    constructor(private appSettingsService: AppSettingsService) {
    }

    public get hasSession(): boolean {
        return !!this.appSettingsService.getString(AppStatus.SessionID);
    }

    public get sessionId(): string {
        let sessionId = this.appSettingsService.getString(AppStatus.SessionID);
        if (!sessionId) {
            sessionId = this.createNewSession();
        }

        return sessionId;
    }

    private createNewSession(): string {
        const sessionId = Guid.create().toString();
        this.appSettingsService.set(AppStatus.SessionID, sessionId);
        traceDebug("New session ID is: " + sessionId);

        return sessionId;
    }
}
