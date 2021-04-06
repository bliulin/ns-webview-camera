import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { RouterExtensions } from "nativescript-angular";

import * as appSettings from "tns-core-modules/application-settings";
import { Onboarding, Authentication } from "~/app/shared/constants";
import { traceDebug } from "../logging/logging-utils";
import { KeystoreService } from "../services/keystore.service";

@Injectable()
export class PinGuardService implements CanActivate {
    constructor(
        private routerExtensions: RouterExtensions,
        private keyStore: KeystoreService) {}

    public canActivate(): any {
        const isPinSet = appSettings.getBoolean(Authentication.PassCodeEnabled) && !!this.keyStore.getSync(Authentication.Pin);
        traceDebug('🛡️ [PinGuard] Is pin set:' + isPinSet);
        if (!isPinSet) {
            return this.routerExtensions.router.parseUrl('/profile/settings/set-pin/set');
        }
        return true;
    }
}
