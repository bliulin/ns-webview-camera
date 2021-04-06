import { Injectable } from '@angular/core';
import { PushNotificationApiService } from "~/app/core/services/push-notifications/push-notification-api.service";
import { traceDebug, traceError } from "~/app/core/logging/logging-utils";
import { AppSettingsService } from "~/app/core/services/app-settings.service";
import { AppEvents, AppStatus, Constants, Profile, PushNotificationsConstants } from "~/app/shared/constants";
import { AuthenticationService } from "~/app/core/authentication/authentication.service";
import { BehaviorSubject, combineLatest, Observable, of, Subject } from "rxjs";
import { delay, distinct, filter, map, mapTo, skip, switchMap, take, tap } from "rxjs/internal/operators";
import { MessagingService } from "~/app/core/services/messaging.service";
import { AppState } from "~/app/shared/models";
import { FirebaseService } from "~/app/core/services/push-notifications/firebase.service";
import { PnHandlerService } from "~/app/core/services/push-notifications/pn-handler.service";
import { UnlockService } from "~/app/core/services/unlock.service";
import { PushMessageModel } from "~/app/core/models/notifications/push-message-model";
import { parseBoolean } from "~/app/shared/utils/utils";
import { OmroSessionService } from "~/app/core/services/omro-session.service";
import { UserProfileStateService } from "~/app/core/services/profile/user-profile-state.service";
import { doNothing } from "~/app/core/utils/utils";

/*
* This class handles registration, unregistration and controls the way push messages are handled.
* */
@Injectable({
    providedIn: 'root'
})
export class PushNotificationsService {

    private _pushMessages$: Subject<PushMessageModel> = new Subject<PushMessageModel>();
    private _firebasePushToken$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private _pushRegistrationCompleted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    private _messageToProcess: Array<PushMessageModel> = [];
    private _busy: boolean = false;

    constructor(private api: PushNotificationApiService,
                private appSettings: AppSettingsService,
                private authService: AuthenticationService,
                private messagingService: MessagingService,
                private firebaseService: FirebaseService,
                private pnHandler: PnHandlerService,
                private unlockService: UnlockService,
                private sessionService: OmroSessionService,
                private userService: UserProfileStateService) {
    }

    public registerPushHandlers(): void {
        this.registerForPushNotifications();

        this.firebaseService.init().then(() => {
            this.firebaseService.registerPushHandlers();
        }, err => {
        });

        this.firebaseService.pushToken.subscribe(token => this._firebasePushToken$.next(token));
        this.firebaseService.pushMessage.subscribe(message => {
            if (!message.data) {
                traceDebug('Message has no data field!');
                return;
            }

            const messageData: PushMessageModel = <PushMessageModel>message.data;
            if (!messageData.filboNotificationId) {
                traceError('Message data does not contain the FilboNotificationId!');
                return;
            }

            this._pushMessages$.next(messageData);
        });
    }

    // This method is for unit testing
    public pushMessage(messageData: PushMessageModel): void {
        this._pushMessages$.next(messageData);
    }

    private unregister(): Observable<any> {
        const registrationNo = this.appSettings.getNumber(PushNotificationsConstants.OmroPushRegistrationNumber);
        return this.api.deletePushNotificationRegistration(registrationNo);
    }

    private registerForPushNotifications(): void {
        // Handle push registration
        this.authService.authenticated$
            .pipe(
                filter((isAuthenticated: boolean) => isAuthenticated === true)
                , switchMap(() => this._firebasePushToken$)
                , filter((token: string) => !!token)
            )
            .subscribe((token: string) => this.handlePushRegistrationIdentifiers(token));

        // store push messages for processing
        this._pushMessages$
            .pipe(
                tap(notif => traceDebug('Push message inserted into stream.'))
                , distinct(notif => notif.filboNotificationId)
            )
            .subscribe(message => this._messageToProcess.push(message));

        this.messagingService.getEvent(AppEvents.LoggingOut)
            .subscribe(async () => {
                traceDebug('Logged out!');
                await this.unregister().toPromise();
                this._pushRegistrationCompleted$.next(false);
            });

        // Get active notifications from the server
        this.messagingService.getState<AppState>(AppEvents.AppState).subscribe(state => {
            if (state === AppState.LAUNCHED || state === AppState.RESUMED) {
                this._pushRegistrationCompleted$.pipe(
                    filter(completed => completed === true),
                    delay(5000),
                    take(1),
                    switchMap(() => this.api.getActiveNotifications()),
                    take(1)
                ).subscribe((notifications: Array<PushMessageModel>) => {
                    traceDebug('Received ' + notifications.length + ' notifications via XHR, sending to push stream...');
                    // push notifications from HTTP result into the pushMessages stream to be handled as push messages
                    notifications.forEach(notif => this._pushMessages$.next(notif));
                });
            }
        });

        this.handleMessages();
    }

    private async handlePushRegistrationIdentifiers(token: string): Promise<void> {
        traceDebug('Handling push registration handler...');

        let previousPushRegistrationNumber = this.appSettings.getNumber(PushNotificationsConstants.OmroPushRegistrationNumber);
        if (!!previousPushRegistrationNumber) {
            traceDebug("Deleting previous registration no: " + previousPushRegistrationNumber);
            await this.api.deletePushNotificationRegistration(previousPushRegistrationNumber).toPromise();
            previousPushRegistrationNumber = null;
            this.appSettings.remove(PushNotificationsConstants.OmroPushRegistrationNumber);
        }

        const registration: number = await this.api.registerForPushNotifications(token).toPromise();
        traceDebug(`Registration created, number ${registration} for token ${token} and session ID ${this.sessionService.sessionId}`);
        this.appSettings.set(PushNotificationsConstants.FirebasePushToken, token);
        this.appSettings.set(PushNotificationsConstants.OmroPushRegistrationNumber, registration);

        this._pushRegistrationCompleted$.next(true);
    }

    private async setNotificationAsRead(filboNotificationId: string): Promise<boolean> {
        traceDebug('Setting notification as read...');
        try {
            await this.api.setNotificationAsRead(filboNotificationId).toPromise();
            return true;
        } catch (e) {
            traceError('Failed to mark notification as read: ' + e);
            return false;
        }
    }

    private async processMessage(pushMessage: PushMessageModel): Promise<boolean> {
        traceDebug('START processMessage; Handling push message: ' + JSON.stringify(pushMessage));

        await this.pnHandler.handleMessage(pushMessage);
        const ok = await this.setNotificationAsRead(pushMessage.filboNotificationId);

        traceDebug(`Message with ID ${pushMessage.filboNotificationId} was processed!`);
        return ok;
    }

    private handleMessages(): void {
        this.canStartHandlingPushMessages
            .pipe(filter(value => !!value))
            .subscribe(() => {
                setInterval(async () => {
                    if (this.canHandlePushMessages) {
                        this._busy = true;
                        try {
                            const message = await this.fetchMessageData();
                            if (message && await this.isValidMessage(message)) {
                                await this.processMessage(message);
                            }
                            else {
                                traceError(`Message is not valid (might not be for this user): ${JSON.stringify(message)}`);
                            }
                        }
                        catch (e) {
                            traceError('Failed to process message: ' + e);
                        }
                        await doNothing(15000);
                        this._busy = false;
                    }
                }, 1000);
            });
    }

    private async fetchMessageData(): Promise<PushMessageModel> {
        let pushMessage = this._messageToProcess.shift();

        let complete: boolean = false;
        if (pushMessage.complete) {
            complete = pushMessage.complete;
        }

        pushMessage.complete = parseBoolean(complete.toString());
        traceDebug('complete = ' + pushMessage.complete);

        if (!!pushMessage.complete) {
            return pushMessage;
        }

        traceDebug('Message not complete, fetching data...');
        const id = pushMessage.filboNotificationId;

        try {
            pushMessage = await this.api.getActiveNotificationById(id).toPromise();
        }
        catch (e) {
            traceError('Failed to get push message by XHR: ' + e);
            return null;
        }

        if (!pushMessage) {
            traceDebug('No available message retrieved for ID = ' + id);
        }

        return pushMessage;
    }

    private get canStartHandlingPushMessages(): Observable<boolean> {
        return combineLatest([this._pushRegistrationCompleted$, this.unlockService.locked$])
            .pipe(map((values) => values[0] === true && values[1] === false));
    }

    private get canHandlePushMessages(): boolean {
        return !this._busy && this._messageToProcess.length > 0 && !this.unlockService.isLocked;
    }

    private isValidMessage(message: PushMessageModel): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.userService.companies$.subscribe(companies => {
               const index = companies.findIndex(c => c.customer.customerId === message.customerId);
               resolve(index >= 0);
            });
        });
    }
}
