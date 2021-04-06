import { NgModule } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptLocalizeModule } from "nativescript-localize/angular";
import {
    TNSFontIconModule} from "nativescript-ngx-fonticon";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";

import { registerElement } from "nativescript-angular";
import { Carousel, CarouselItem } from "nativescript-carousel";

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

    ]
})
export class CoreModule {}
