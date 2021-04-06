import { EventEmitter, Injectable } from '@angular/core';
import { isAndroid } from "tns-core-modules/platform";
import { android, AndroidActivityBackPressedEventData, AndroidApplication } from "tns-core-modules/application";
import { KycService } from "~/app/kyc/services/kyc.service";
import { take } from "rxjs/internal/operators";
import { traceDebug } from "~/app/core/logging/logging-utils";

@Injectable()
export class BackButtonHandlerService {

    constructor(private kycService: KycService) {
    }

    public backPressed: EventEmitter<any> = new EventEmitter();

    public registerBackButtonHandler(): void {
        if (!isAndroid) {
            return;
        }

        this.disableBackHandler();

        this.kycService.canGoBack
            .pipe(take(1))
            .subscribe(ok => {
                if (!ok) {
                    android.on(AndroidApplication.activityBackPressedEvent, this.supressCallback);
                } else {
                    android.on(AndroidApplication.activityBackPressedEvent, this.goBackOneStepCallback);
                    traceDebug('Back button should go one step back');
                }
            });
    }

    public supressBackButton(): void {
        if (!isAndroid) {
            return;
        }
        android.on(AndroidApplication.activityBackPressedEvent, this.supressCallback);
        traceDebug('Back button supressed');
    }

    public disableBackHandler(): void {
        if (!isAndroid) {
            return;
        }
        traceDebug('Disabling activity back pressed event...');
        android.off(AndroidApplication.activityBackPressedEvent, this.goBackOneStepCallback);
        android.off(AndroidApplication.activityBackPressedEvent, this.supressCallback);
        android.off(AndroidApplication.activityBackPressedEvent, this.supressCallbackAndEmit);
    }

    private supressCallbackAndEmit = (args: AndroidActivityBackPressedEventData) => {
        traceDebug('supressCallback called!');
        args.cancel = true;
        this.backPressed.emit();
    }

    private supressCallback = (args: AndroidActivityBackPressedEventData) => {
        traceDebug('supressCallback called!');
        args.cancel = true;
    }

    private goBackOneStepCallback = (args: AndroidActivityBackPressedEventData) => {
        traceDebug('goBackOneStepCallback called!');
        this.kycService.goBack();
    }
}
