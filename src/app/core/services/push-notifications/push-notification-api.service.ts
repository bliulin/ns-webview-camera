import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of, pipe, throwError } from "rxjs";
import { APP_CONFIG } from "~/app/core/environment";
import { FilboNotificationsOutputModel } from "~/app/core/models/notifications/filboNotificationsOutputModel";
import { filter, first, map, switchMap } from "rxjs/internal/operators";
import { PushMessageModel } from "~/app/core/models/notifications/push-message-model";
import { delayedRetry } from "~/app/core/utils/delayed-retry";
import { traceDebug } from "~/app/core/logging/logging-utils";

@Injectable({
    providedIn: 'root'
})
export class PushNotificationApiService {

    constructor(private httpClient: HttpClient) {
    }

    public getActiveNotifications(): Observable<Array<PushMessageModel>> {
        const url = APP_CONFIG.baseUrl + 'Private/activeNotifications';

        // List of notifications which were not yet handled, sorted by priority
        // The content of the push message is located in the serializedDictionary field, which must be parsed.

        return this.httpClient.get<Array<FilboNotificationsOutputModel>>(url, { headers: this.backgroundRequestHeaders }).pipe(
            map(items => items.sort((a, b) => {
                if (a.priority < b.priority) {
                    return -1;
                }
                if (a.priority > b.priority) {
                    return 1;
                }
                return 0;
            })),
            map(filboNotifications => filboNotifications.map(notif => <PushMessageModel>JSON.parse(notif.serializedDictionary))));
    }

    public getActiveNotificationById(notificationId: string): Observable<PushMessageModel> {
        const url = `${APP_CONFIG.baseUrl}Private/activeNotificationById?notificationId=${notificationId}`;

        return this.httpClient.get<FilboNotificationsOutputModel>(url, { headers: this.backgroundRequestHeaders })
            .pipe(
                switchMap(notif => {
                    traceDebug("Notification via XHR: " + JSON.stringify(notif));
                    return notif ? of(notif) : throwError(notif);
                }),
                delayedRetry(1000, 3),
                map(filboNotif => <PushMessageModel> JSON.parse(filboNotif.serializedDictionary))
            );
    }

    public deletePushNotificationRegistration(registrationId: number): Observable<any> {
        const url = `${APP_CONFIG.baseUrl}Private/deletePushNotificationRegistration?registrationId=${registrationId}`;
        return this.httpClient.delete(url, { headers: this.backgroundRequestHeaders });
    }

    public registerForPushNotifications(fcmDeviceToken: string): Observable<number> {
        const url = `${APP_CONFIG.baseUrl}Private/registerforpushnotifications?handle=${fcmDeviceToken}&platform=fcm`;
        return this.httpClient.post<number>(url, {}, { headers: this.backgroundRequestHeaders });
    }

    public setNotificationAsRead(notificationId: string): Observable<any> {
        const url = `${APP_CONFIG.baseUrl}Private/setNotificationAsRead?notificationId=${notificationId}`;
        return this.httpClient.post(url, {}, { headers: this.backgroundRequestHeaders });
    }

    private get backgroundRequestHeaders(): HttpHeaders {
        let httpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.set('X-BackgroundRequest', '');
        return httpHeaders;
    }
}
