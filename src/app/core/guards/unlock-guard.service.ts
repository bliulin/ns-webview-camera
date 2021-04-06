import { CanActivate } from "@angular/router";
import { UnlockService } from "~/app/core/services/unlock.service";
import { traceDebug } from "~/app/core/logging/logging-utils";
import { filter, mapTo } from "rxjs/internal/operators";
import { tap } from "rxjs/internal/operators/tap";
import { Observable, of } from "rxjs";
import { APP_CONFIG } from "~/app/core/environment";

export class UnlockGuardService implements CanActivate {
    constructor(private unlockService: UnlockService) {}

    public canActivate(): Observable<boolean> {
        traceDebug("[UnlockGuard] Activated");

        return this.unlockService.locked$
            .pipe(filter(locked => !locked))
            .pipe(mapTo(true))
            .pipe(tap(v => traceDebug("[UnlockGuard] Success")));
    }
}
