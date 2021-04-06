import { RouterExtensions } from 'nativescript-angular';
import { OnDestroy } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { delay, filter, switchMap, take, takeUntil } from 'rxjs/internal/operators';
import { NoConnectivityError } from '~/app/core/models/no-connectivity-error';
import { ApplicationService } from '~/app/core/services/application.service';
import { isIOS, isAndroid } from 'tns-core-modules/platform';
import * as utils from 'tns-core-modules/utils/utils';
import * as frameModule from 'tns-core-modules/ui/frame';

export abstract class BaseComponent implements OnDestroy {
    protected unsubscribe$: Subject<void> = new Subject();

    protected constructor(protected routerExtensions: RouterExtensions, protected application?: ApplicationService) {}

    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    public dismissSoftKeyboard(): void {
        if (isIOS) {
            frameModule.Frame.topmost().nativeView.endEditing(true);
        }
        if (isAndroid) {
            utils.ad.dismissSoftInput();
        }
    }

    protected redirectTo(path: string, clearHistory: boolean = false, transition: string = 'slideLeft'): void {
        this.routerExtensions.navigate([path], {
            clearHistory: clearHistory,
            transition: {
                name: transition
            }
        });
    }

    protected navigateToDashboard(path: string, transition: string = 'fade', clearHistory: boolean = true): void {
        this.dismissSoftKeyboard();
        this.routerExtensions.navigate(['/dashboard', { outlets: { dashboard: [path] } }], {
            clearHistory: clearHistory,
            transition: {
                name: transition
            }
        });
    }

    protected goBack(): void {
        this.dismissSoftKeyboard();
        this.routerExtensions.backToPreviousPage();
    }

    /**
     * Returns a function to be used as a parameter for the RxJs 'retryWhen' operator.
     * After a HTTP call fails due to no internet connection, it will wait
     * until the internet comes back and then try again
     */
    protected getNoConnectivityRetryStrategy() {
        if (!this.application) {
            throw new Error(`[${this.constructor.name}] No ApplicationService found in BaseComponent. 
            Please provide applicationService in BaseComponent.super() call`);
        }
        return (errors: Observable<any>) => {
            return errors.pipe(
                switchMap((err) => {
                    if (err instanceof NoConnectivityError) {
                        return this.application.hasInternet$.pipe(
                            takeUntil(this.unsubscribe$),
                            filter((v) => v),
                            delay(500),
                            take(1)
                        );
                    } else {
                        return throwError(err);
                    }
                })
            );
        };
    }
}
