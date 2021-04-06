import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from '~/app/core/environment';
import { traceDebug } from '~/app/core/logging/logging-utils';
import { OmroSessionService } from '~/app/core/services/omro-session.service';
import { UserInfo } from '../models/user-info';
import { device } from "tns-core-modules/platform";
import { Guid } from 'guid-typescript';

@Injectable()
export class AnalyticsService {
    private userInfo: UserInfo;
    private appInsightsUserId: string;
    private appInsightsOperationId: string;

    constructor(private httpClient: HttpClient,
        private omroSessionService: OmroSessionService) {
            this.appInsightsUserId = Guid.create().toString();
            this.appInsightsOperationId = Guid.create().toString();
        }

    public updateUserInfo(newInfo: UserInfo){
        const updatedUserInfo = { ...this.userInfo, ...newInfo };
        this.userInfo = updatedUserInfo;
    }

    public trackEvent(name: string, url: string, properties?: any) {
        traceDebug("track event: " + name);

        let enrichedProperties = {
            response: JSON.stringify(properties)
        };
        if (this.userInfo) {
            enrichedProperties = {
              ...enrichedProperties,
              ...{
                cui: this.userInfo.cui,
                email: this.userInfo.email.toLowerCase(),
                phone: this.userInfo.phoneNumber,
                fullName: `${this.userInfo.firstName} ${this.userInfo.lastName}`,
                clientSessionId: this.omroSessionService.sessionId,
                userId: this.userInfo.userId
              }
            };
        }

        const requestBody = {
            time: new Date(),
            iKey: APP_CONFIG.instrumentationKey,
            name: "Microsoft.ApplicationInsights.9cf369d9bb7b44a889697dc041fa01d8.Event",
            tags: {
                "ai.user.id": this.appInsightsUserId,
                "ai.session.id": this.omroSessionService.sessionId,
                "ai.device.id": device.uuid,
                "ai.device.type": device.model,
                "ai.operation.name": url,
                "ai.operation.id": this.appInsightsOperationId,
                "ai.internal.sdkVersion": "OMROOverride"
            },
            data: {
                baseType: "EventData",
                baseData: {
                    ver: 2,
                    name: name,
                    properties: enrichedProperties,
                    measurements: {}
                }
            }
        };
        this.httpClient.post(APP_CONFIG.applicationInsightsUrl, requestBody).subscribe();
    }
}