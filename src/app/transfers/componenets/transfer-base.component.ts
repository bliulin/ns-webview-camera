import { BaseComponent } from "~/app/shared/base.component";
import { OnDestroy } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular';
import { android, AndroidActivityBackPressedEventData, AndroidApplication } from 'tns-core-modules/application';
import { isAndroid } from "tns-core-modules/platform";
import { ApplicationService } from "~/app/core/services/application.service";

export abstract class TransferBaseComponent extends BaseComponent implements OnDestroy {
    protected constructor(protected page: Page,
                          protected router: RouterExtensions,
                          protected application?: ApplicationService) {
        super(router);
        this.handleHardwareBackButtonAndroid();
        this.page.enableSwipeBackNavigation = false;
        this.page.actionBarHidden = true;
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        if (isAndroid) {
            android.off(AndroidApplication.activityBackPressedEvent, this.customHandleBackButton);
        }
    }

    protected abstract navigateBack(): void;

    private handleHardwareBackButtonAndroid(): void {
        if (!isAndroid) {
            return;
        }
        android.on(AndroidApplication.activityBackPressedEvent, this.customHandleBackButton);
    }

    private customHandleBackButton = async (args: AndroidActivityBackPressedEventData) => {
        args.cancel = true;
        await this.navigateBack();
    }
}
