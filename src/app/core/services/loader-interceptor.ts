import { Injectable } from "@angular/core";
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { ActivityLoaderService } from "~/app/core/services/activity-loader.service";
import { tap } from "rxjs/internal/operators/tap";
import { catchError } from "rxjs/internal/operators";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(private activityLoaderService: ActivityLoaderService) {}

    public intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if(req.headers.has('X-BackgroundRequest')){
            req.headers.delete('X-BackgroundRequest');
            return next.handle(req);
        }
        this.activityLoaderService.onRequestStart();
        return next.handle(req).pipe(
            tap(
                (event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        this.activityLoaderService.onRequestEnd();
                    }
                }
            ),
            catchError(err => {
                this.activityLoaderService.onRequestEnd();
                return throwError(err);
            })
        );
    }
}
