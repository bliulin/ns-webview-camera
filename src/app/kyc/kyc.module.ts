import { CameraComponent } from './components/camera/camera.component';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from "~/app/shared/shared.module";
import { KycStepComponent } from './components/kyc-step/kyc-step.component';
import { KycProgressComponent } from './components/kyc-progress/kyc-progress.component';
import { KycExecutionModalComponent } from './components/kyc-execution-modal/kyc-execution-modal.component';
import { KycRoutingModule } from "~/app/kyc/kyc-routing.module";
import { KycFinishComponent } from './components/kyc-finish/kyc-finish.component';
import { KycService } from "~/app/kyc/services/kyc.service";
import { KycApiService } from "~/app/kyc/services/kyc-api.service";
import { BackButtonHandlerService } from "~/app/kyc/services/back-button-handler.service";
import { KycPlaceholderModalComponent } from "~/app/kyc/components/kyc-placeholder-modal/kyc-placeholder-modal.component";
import { KycRedirectFinishComponent } from "~/app/kyc/components/kyc-redirect-finish/kyc-redirect-finish.component";

@NgModule({
    declarations: [KycStepComponent,
        KycProgressComponent,
        KycExecutionModalComponent,
        KycFinishComponent,
        KycPlaceholderModalComponent,
        KycRedirectFinishComponent,
        CameraComponent
    ],
    imports: [
        KycRoutingModule,
        SharedModule
    ],
    providers: [KycService, KycApiService, BackButtonHandlerService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class KycModule {
}
