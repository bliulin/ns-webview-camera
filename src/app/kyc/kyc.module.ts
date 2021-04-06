import { CameraComponent } from './components/camera/camera.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from "~/app/shared/shared.module";
import { KycRoutingModule } from "~/app/kyc/kyc-routing.module";

@NgModule({
    declarations: [
        CameraComponent
    ],
    imports: [
        KycRoutingModule,
        SharedModule
    ],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA]
})
export class KycModule {
}
