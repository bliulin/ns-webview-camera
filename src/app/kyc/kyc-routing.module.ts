import { CameraComponent } from './components/camera/camera.component';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular";
import { Routes } from "@angular/router";

const routes: Routes = [
    //{ path: ':source', redirectTo: 'kyc-step' },
    { path: '', redirectTo: 'kyc-camera' },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class KycRoutingModule {

}
