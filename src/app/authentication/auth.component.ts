import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { APP_CONFIG } from "../core/environment";
import { traceDebug, traceError } from "../core/logging/logging-utils";
import { AuthenticationService } from "../core/authentication/authentication.service";
import { RouterExtensions } from "nativescript-angular";
import { LoginResponse } from "../core/authentication/login-response";
import { Page } from "tns-core-modules/ui/page/page";
import { AppEvents } from "~/app/shared/constants";
import { MessagingService } from "~/app/core/services/messaging.service";

@Component({
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
    public loginUrl: string;
    public showWebView: boolean = true;

    constructor(private authService: AuthenticationService,
        private routerExtensions: RouterExtensions,
        private page: Page,
        private messagingService: MessagingService) { }

    public ngOnInit(): void {
        this.page.actionBarHidden = true;
        this.navigateToLogin();
    }

    public onLoadStarted(args: any): void {
        traceDebug('Load started: ' + args.url);
        const url: string = args.url;
        if (url.startsWith(APP_CONFIG.omroProtocol)) {
            this.showWebView = false;

            if (url === APP_CONFIG.omroProtocol + "onboarding") {
                this.redirectTo("onboarding");
            }
            else {


                this.authService.login(url).subscribe((result: LoginResponse) => {
                    if (result.success) {
                        traceDebug(JSON.stringify(result));
                        traceDebug("LoggedIn success");
                        this.messagingService.setState(AppEvents.LoggedIn, true);
                        this.redirectTo(result.nextUrl);
                    }
                    else {
                        traceError("[auth.component] LoggedIn failed: " + result.error);
                        alert('There was a problem logging you in, please try again!');
                        this.navigateToLogin();
                    }
                });
            }
        }
    }

    private navigateToLogin(): void {
        this.showWebView = true;
        this.loginUrl = this.authService.getLoginUrl();
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
