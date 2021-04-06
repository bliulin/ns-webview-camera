import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from "nativescript-angular";
import { Page } from "tns-core-modules/ui/page/page";
import { traceDebug, traceError } from "~/app/core/logging/logging-utils";
import { AuthenticationService } from "~/app/core/authentication/authentication.service";
import { MessagingService } from "~/app/core/services/messaging.service";
import { AppEvents } from "~/app/shared/constants";
import { delay, take } from "rxjs/internal/operators";

@Component({
    selector: 'omro-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

    public url: string;

    constructor(private routerExtensions: RouterExtensions,
                private page: Page,
                private authService: AuthenticationService,
                private messagingService: MessagingService) {
        this.page.actionBarHidden = true;
    }

    public async ngOnInit(): Promise<void> {
        this.messagingService.raiseEvent(AppEvents.LoggingOut, null);
        await delay(1000); // wait 1 second for all subscribers to handle the logging out event.

        this.authService.endSession()
            .pipe(take(1))
            .subscribe(response => {
                const urlLogoutRemoveCookies = this.authService.getLogoutUrl();
                this.url = urlLogoutRemoveCookies;
                traceDebug("LoggedOut URL: " + this.url);
            });
    }

    onLoadStarted(args) {
        traceDebug('Load started: ' + args.url);
    }

    public async onLoadFinished(args: any): Promise<void> {
        console.log("ARGS: " + args.url);
        try {
            if (args.url.indexOf('account/logoutapp') >= 0) {
                await this.authService.clearSessionData();
                traceDebug('Logged out, redirecting.');
                this.messagingService.raiseEvent(AppEvents.LoggedOut, null);
                this.redirectTo('');
            }
        } catch (e) {
            traceError('ERROR logging out: ' + e);
        }
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate([path], {
            transition: {
                name: "fade"
            },
            clearHistory: true
        });
    }
}
