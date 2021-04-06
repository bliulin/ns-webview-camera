import { PreloadingStrategy, Route } from "@angular/router";
import { Observable } from "rxjs";
import { of } from "rxjs/internal/observable/of";

export class AppRoutingPreloadStrategy implements PreloadingStrategy {
    preload(route: Route, load: Function): Observable<any> {
        if (route.data && route.data.preload) {
            console.log('Preloading route:' + route.path)
            return load();
        } else {
            return of(null);
        }
    }
}
