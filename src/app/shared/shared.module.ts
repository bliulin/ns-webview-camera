import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptLocalizeModule } from 'nativescript-localize/angular';
import { CommonModule } from '@angular/common';
import { NativeScriptSvgModule } from '@teammaestro/nativescript-svg/angular';
import { WebViewExtModule } from '@nota/nativescript-webview-ext/angular';

// This is a module that should be imported in every feature module. It should export vital modules like
// NativeScriptCommonModule, and it should contain directives and components used by every feature module.
// It should NOT be used for things that are only shared by a limited number of feature modules.
@NgModule({
    imports: [
        CommonModule,
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
        NativeScriptLocalizeModule,
        NativeScriptSvgModule,
        WebViewExtModule
    ],
    exports: [
        CommonModule,
        NativeScriptCommonModule,
        NativeScriptFormsModule,
        ReactiveFormsModule,
        NativeScriptLocalizeModule,

        WebViewExtModule
    ],
    declarations: [
    ],
    providers: [],
    entryComponents: [

    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class SharedModule {}
