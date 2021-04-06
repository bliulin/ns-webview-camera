import { Injectable, ViewContainerRef } from '@angular/core';
import { InternetConnectivityService } from '~/app/core/services/internet-connectivity.service';
import { Observable } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular';
import { AuthorizationService } from '~/app/unlock/authorization.service';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    constructor(
        private internetConnectivity: InternetConnectivityService,
        public routerExt: RouterExtensions,
        private authorizationService: AuthorizationService
    ) {}

    public get hasInternet$(): Observable<boolean> {
        return this.internetConnectivity.connectionStatus$;
    }

    public get hasInternet(): boolean {
        return this.internetConnectivity.connectionStatus;
    }

    public goHome() {
        this.routerExt.navigate(['/dashboard', { outlets: { dashboard: ['home'] } }], {
            clearHistory: true
        });
    }

    public authorizeAction(): Observable<void> {
        return this.authorizationService.authorizeAction();
    }
}
