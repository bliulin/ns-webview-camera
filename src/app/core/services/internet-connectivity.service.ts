import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { startMonitoring, getConnectionType } from 'tns-core-modules/connectivity/connectivity';

@Injectable({
    providedIn: 'root'
})
export class InternetConnectivityService {
    private _connectionStatusSubject$: BehaviorSubject<boolean>;

    constructor() {
        this._connectionStatusSubject$ = new BehaviorSubject<boolean>(getConnectionType() != 0);
        startMonitoring(connectionType => {
            if (connectionType == 0) {
                this._connectionStatusSubject$.next(false);
            } else this._connectionStatusSubject$.next(true);
        });
    }

    get connectionStatus$(): Observable<boolean> {
        return this._connectionStatusSubject$.asObservable();
    }

    get connectionStatus(): boolean {
        return this._connectionStatusSubject$.value;
    }
}
