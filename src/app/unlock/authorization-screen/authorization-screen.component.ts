import { Component, OnInit } from '@angular/core';
import { AuthorizationResult } from '~/app/unlock/authorization-result';
import { AuthorizationService } from '~/app/unlock/authorization.service';
import { AuthorizationIntent } from '~/app/unlock/authorizationIntent';
import { RouterExtensions } from 'nativescript-angular';
import { MessagingService } from '~/app/core/services/messaging.service';
import { AppEvents } from '~/app/shared/constants';
import { filter, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '~/app/shared/base.component';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
    selector: 'omro-auth-screen',
    templateUrl: './authorization-screen.component.html',
    styleUrls: ['./authorization-screen.component.scss']
})
export class AuthorizationScreenComponent extends BaseComponent implements OnInit {
    private authIntent: AuthorizationIntent;
    constructor(
        private authorizationService: AuthorizationService,
        private messagingService: MessagingService,
        routerExt: RouterExtensions,
        page: Page
    ) {
        super(routerExt);
        page.actionBarHidden = true;
        this.authIntent = authorizationService.getAuthorizationIntent();
    }

    public ngOnInit(): void {
        this.messagingService
            .getState<boolean>(AppEvents.AppSuspended)
            .pipe(takeUntil(this.unsubscribe$))
            .pipe(filter(v => v))
            .subscribe(() => {
                this.onTapCancel();
            });
    }

    public onAuthComplete(result: AuthorizationResult) {
        this.authIntent.resolve(result);
        this.routerExtensions.back();
    }

    public onTapCancel() {
        this.authIntent.resolve(AuthorizationResult.Canceled);
        this.routerExtensions.back();
    }
}
