import { CameraComponent } from './kyc/components/camera/camera.component';
import { NgModule, NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AppRoutingPreloadStrategy } from '~/app/app-routing.preload-strategy';

import { registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';

registerLocaleData(localeRo, 'ro-RO');

@NgModule({
    bootstrap: [AppComponent],
    providers: [AppRoutingPreloadStrategy, { provide: LOCALE_ID, useValue: 'en-US' }],
    imports: [
        AppRoutingModule,
        CoreModule,
    ],
    declarations: [AppComponent, CameraComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
