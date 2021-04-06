import { PreloadingStrategy, Route } from "@angular/router";
import { Observable } from "rxjs";
import { of } from "rxjs/internal/observable/of";
import { traceDebug } from "~/app/core/logging/logging-utils";

export class AppRoutingPreloadStrategy implements PreloadingStrategy {
    preload(route: Route, load: Function): Observable<any> {
        if (route.data && route.data.preload) {
            traceDebug('Preloading route:' + route.path)
            return load();
        } else {
            return of(null);
        }
    }
}
