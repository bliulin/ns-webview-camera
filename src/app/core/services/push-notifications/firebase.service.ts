import { Injectable } from '@angular/core';
import { traceDebug, traceError } from "~/app/core/logging/logging-utils";
import { BehaviorSubject, Subject } from "rxjs";

const nsFirebase = require('nativescript-plugin-firebase');

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    constructor() {
    }

    public pushToken: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public pushMessage: Subject<any> = new Subject<any>();

    public init(): Promise<void> {
        return this.firebase
            .init({
                showNotifications: true,
                showNotificationsWhenInForeground: false
            })
            .then(
                () => {
                    traceDebug('[Firebase] Initalization done!');
                },
                error => {
                    traceDebug(`[Firebase] Initialization error: ${error}`);
                }
            );
    }

    public registerPushHandlers(): void {
        this.firebase.addOnPushTokenReceivedCallback(
            async token => {
                traceDebug("Firebase plugin received a push token: " + token);
                this.pushToken.next(token);
            }
        );

        this.firebase.addOnMessageReceivedCallback(
            async message => {
                traceDebug("Push message received: " + JSON.stringify(message));
                this.pushMessage.next(message);
            }
        ).then(() => {
            traceDebug("Added addOnMessageReceivedCallback");
        }, err => {
            traceDebug("Failed to add addOnMessageReceivedCallback: " + err);
        });
    }

    protected get firebase(): any {
        return nsFirebase;
    }
}
