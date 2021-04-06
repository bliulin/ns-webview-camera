import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular";
import { Routes } from "@angular/router";
import { KycStepComponent } from "~/app/kyc/components/kyc-step/kyc-step.component";
import { KycFinishComponent } from "~/app/kyc/components/kyc-finish/kyc-finish.component";
import { KycRedirectFinishComponent } from "~/app/kyc/components/kyc-redirect-finish/kyc-redirect-finish.component";
import { KycExecutionModalComponent } from "~/app/kyc/components/kyc-execution-modal/kyc-execution-modal.component";
import { KycPlaceholderModalComponent } from "~/app/kyc/components/kyc-placeholder-modal/kyc-placeholder-modal.component";
import { KycService } from "~/app/kyc/services/kyc.service";
import { BackButtonHandlerService } from "~/app/kyc/services/back-button-handler.service";
import { KycApiService } from "~/app/kyc/services/kyc-api.service";

const routes: Routes = [
    //{ path: ':source', redirectTo: 'kyc-step' },
    { path: '', redirectTo: 'kyc-step' },
    { path: 'kyc-step', component: KycStepComponent, pathMatch: 'full' },
    { path: 'kyc-execution', component: KycExecutionModalComponent, pathMatch: 'full' },
    { path: 'kyc-placeholder', component: KycPlaceholderModalComponent, pathMatch: 'full' },
    { path: 'kyc-finish', component: KycFinishComponent, pathMatch: 'full' },
    { path: 'kyc-redirect-finish', component: KycRedirectFinishComponent, pathMatch: 'full' }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class KycRoutingModule {

}
