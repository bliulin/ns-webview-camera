// src/app/auth/token.interceptor.ts
import { Injectable } from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpResponseBase,
    HttpRequest
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, timeout } from 'rxjs/operators';
import { traceError, traceDebug } from '../logging/logging-utils';
import { HttpRequestService } from './http-request.service';
import { AuthenticationService } from './authentication.service';
import { tap } from 'rxjs/internal/operators/tap';
import { NoConnectivityError } from '~/app/core/models/no-connectivity-error';
import { InternetConnectivityService } from '~/app/core/services/internet-connectivity.service';
import { RouterExtensions } from 'nativescript-angular';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
    private isRefreshing: boolean = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private httpRequestService: HttpRequestService,
        private authService: AuthenticationService,
        private internetConnectivityService: InternetConnectivityService,
        private routerExtensions: RouterExtensions
    ) {}

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        traceDebug('Interceptor called for url: ' + request.url);

        if (!this.internetConnectivityService.connectionStatus) {
            traceDebug('NO INTERNET!!!')
            return throwError(new NoConnectivityError());
        }

        const headers = this.httpRequestService.getStandardRequestHeaders();
        // traceDebug('Request headers:');
        request = request.clone({
            setHeaders: headers.reduce((acc: { [key: string]: any }, header) => {
                const requestHeaderValue = request.headers.get(header.name);
                acc[header.name] = requestHeaderValue ? requestHeaderValue : header.value || '';
                traceDebug(`${header.name}: ${acc[header.name]}`);
                return acc;
            }, {})
        });

        return next
            .handle(request)
            .pipe(
                tap((response) => {
                    if (response instanceof HttpResponseBase) {
                        traceDebug(`Status: ${response.status} ${response.statusText} for url: ${response.url}`);
                    }
                })
            )
            .pipe(timeout(20000))
            .pipe(
                catchError((err: any) => {
                    traceError('HTTP error: ' + JSON.stringify(err));
                    if (err instanceof HttpErrorResponse) {
                        switch (err.status) {
                            case 401:
                                return this.handle401Error(request, next);
                            case 0:
                                return throwError(new NoConnectivityError());
                            default:
                                return throwError(err);
                        }
                    }
                    return throwError(err);
                })
            );
    }

    private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshToken()
            .pipe(
                switchMap((token: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(token.access_token);
                    return next.handle(this.addToken(request, token.access_token));
                })
            )
            .pipe(
                catchError((err: any) => {
                    traceError('HTTP error in handle401Error: ' + JSON.stringify(err));
                    this.routerExtensions.navigate(["login/logout"]);
                    return throwError(err);
                })
            );
        } else {
            return this.refreshTokenSubject.pipe(
                filter((token) => token != null),
                take(1),
                switchMap((jwt) => {
                    return next.handle(this.addToken(request, jwt));
                })
            );
        }
    }
}
