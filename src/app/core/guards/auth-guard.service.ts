import { Injectable } from "@angular/core";
import { CanActivate } from "@angular/router";
import { AuthenticationService } from "../authentication/authentication.service";
import { RouterExtensions } from "nativescript-angular";
import { traceDebug } from "~/app/core/logging/logging-utils";

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private authService: AuthenticationService, private routerExtensions: RouterExtensions) {}

    public canActivate(): any {
        traceDebug('🛡️ [AuthGuard] Activated');
        traceDebug('🛡️ [AuthGuard] Is logged in:' + this.authService.isLoggedIn());
        if (!this.authService.isLoggedIn()) {
            return this.routerExtensions.router.parseUrl('emailreg');
        }
        return true;
    }
}