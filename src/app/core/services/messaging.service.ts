import { Injectable } from "@angular/core";
import { ReplaySubject, Observable, Subject } from "rxjs";
import { traceDebug } from "~/app/core/logging/logging-utils";

export interface GlobalEventArg {
    eventName: string;
    payload: any;
}

@Injectable()
export class MessagingService {
    private eventStore: Map<string, Subject<any>> = new Map<string, Subject<any>>();

    private static _instance: MessagingService;

    public constructor() {
        MessagingService._instance = this;
    }

    public static get instance(): MessagingService {
        return MessagingService._instance;
    }

    public raiseEvent<T>(eventName: string, payload: T): void {
        traceDebug('[MessagingService] Event raised: ' + eventName);
        if (!this.eventStore.has(eventName)) {
            this.eventStore.set(eventName, new Subject<T>());
        }
        const subject: Subject<T> = this.eventStore.get(eventName);
        subject.next(payload);
    }

    public getEvent<T>(eventName: string): Observable<T> {
        if (!this.eventStore.has(eventName)) {
            this.eventStore.set(eventName, new Subject<T>());
        }
        return this.eventStore.get(eventName);
    }

    public setState<T>(stateName: string, payload: T): void {
        if (!this.eventStore.has(stateName)) {
            this.eventStore.set(stateName, new ReplaySubject<T>(1));
        }
        const subject = <ReplaySubject<T>>this.eventStore.get(stateName);
        subject.next(payload);
    }

    public getState<T>(stateName: string): Observable<T> {
        if (!this.eventStore.has(stateName)) {
            this.eventStore.set(stateName, new ReplaySubject<T>(1));
        }
        return this.eventStore.get(stateName);
    }
}
