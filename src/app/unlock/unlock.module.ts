import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '~/app/shared/shared.module';
import { AuthorizationScreenComponent } from './authorization-screen/authorization-screen.component';
import { UnlockScreenComponent } from './unlock-screen/unlock-screen.component';
import { AuthorizationComponent } from './authorization/authorization.component';
import { NativeScriptRouterModule } from 'nativescript-angular';
import { Routes } from "@angular/router";
const routes: Routes = [{
    path:'authorize',
    component:AuthorizationScreenComponent
}]
@NgModule({
    declarations: [AuthorizationComponent, AuthorizationScreenComponent, UnlockScreenComponent],
    imports: [SharedModule,NativeScriptRouterModule.forChild(routes)],
    exports: [AuthorizationScreenComponent, UnlockScreenComponent],
    entryComponents: [AuthorizationScreenComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class UnlockModule {}
