import { NgModule, NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';
import { StartupModule } from './startup/startup.module';
import { DashboardComponent } from '~/app/components/dashboard/dashboard.component';
import { DevLinksComponent } from '~/app/components/dev-links/dev-links.component';
import { AppRoutingPreloadStrategy } from '~/app/app-routing.preload-strategy';
import { NativeScriptMaterialBottomSheetModule } from 'nativescript-material-bottomsheet/angular';
import { UnlockModule } from '~/app/unlock/unlock.module';

import { registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';

registerLocaleData(localeRo, 'ro-RO');

@NgModule({
    bootstrap: [AppComponent],
    providers: [AppRoutingPreloadStrategy, { provide: LOCALE_ID, useValue: 'en-US' }],
    imports: [
        AppRoutingModule,
        CoreModule,
        NativeScriptMaterialBottomSheetModule.forRoot(),
        TNSFontIconModule.forRoot(),
        StartupModule,
        UnlockModule,
    ],
    declarations: [AppComponent, DashboardComponent, DevLinksComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
