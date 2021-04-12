import { NgModule } from "@angular/core";
import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NativeScriptLocalizeModule } from "nativescript-localize/angular";
import { NativeScriptAnimationsModule } from "nativescript-angular/animations";

// This module exports modules that should only be imported once (i.e. NativeScriptModule) and provides services which should
// be singletons per the entire application.
// This module should only be imported once, in the AppModule. It should NOT be imported in any other module.
@NgModule({
    imports: [
        NativeScriptHttpClientModule,
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptLocalizeModule,
        NativeScriptAnimationsModule,
    ],
    exports: [
        NativeScriptHttpClientModule,
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptLocalizeModule,
    ],
    providers: [

    ]
})
export class CoreModule {}
