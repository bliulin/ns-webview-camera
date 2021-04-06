import { NgModule } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptLocalizeModule } from "nativescript-localize/angular";
import {
    TNSFontIconModule,
    TNSFontIconService
} from "nativescript-ngx-fonticon";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";
import { MessagingService } from "./services/messaging.service";
import { AuthenticationService } from "./authentication/authentication.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
    AuthGuardService,
    OnboardingGuardService,
    PinGuardService
} from "./guards";
import { LoaderInterceptor } from "~/app/core/services/loader-interceptor";
import { RequestInterceptor } from "./authentication/request-interceptor";
import { KeystoreService } from "./services/keystore.service";
import { CryptoService } from "./crypto/crypto.service";
import { UnlockGuardService } from "~/app/core/guards/unlock-guard.service";
import { PKCEService } from "./crypto/pkce.service";
import { FingerprintAuth } from "nativescript-fingerprint-auth";
import { BackgroundHttpService } from "~/app/core/services/background-http-service";
import { HttpRequestService } from "./authentication/http-request.service";
import { LocaleService } from "./services/locale.service";
import { CurrencyPipe } from "@angular/common";
import { registerElement } from "nativescript-angular";
import { Carousel, CarouselItem } from "nativescript-carousel";
import { AnalyticsService } from "~/app/core/services/analytics.service";

registerElement('Carousel', () => Carousel);
registerElement('CarouselItem', () => CarouselItem);
registerElement("PreviousNextView", () => require("nativescript-iqkeyboardmanager").PreviousNextView);

// This module exports modules that should only be imported once (i.e. NativeScriptModule) and provides services which should
// be singletons per the entire application.
// This module should only be imported once, in the AppModule. It should NOT be imported in any other module.
@NgModule({
    imports: [
        NativeScriptHttpClientModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativeScriptRouterModule,
        NativeScriptLocalizeModule,
        TNSFontIconModule,
        NativeScriptAnimationsModule,
    ],
    exports: [
        NativeScriptHttpClientModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule,
        NativeScriptRouterModule,
        NativeScriptLocalizeModule,
        TNSFontIconModule,
    ],
    providers: [
        MessagingService,
        AuthenticationService,
        PKCEService,
        TNSFontIconService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoaderInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RequestInterceptor,
            multi: true
        },
        BackgroundHttpService,
        AuthGuardService,
        OnboardingGuardService,
        UnlockGuardService,
        PinGuardService,
        KeystoreService,
        CryptoService,
        FingerprintAuth,
        LocaleService,
        HttpRequestService,
        CurrencyPipe,
        AnalyticsService
    ]
})
export class CoreModule {}
