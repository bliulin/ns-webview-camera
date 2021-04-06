import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

import { OnboardingRoutingModule } from "./onboarding-routing.module";
import { OnboardingComponent } from "./onboarding.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    imports: [
        OnboardingRoutingModule,
        SharedModule
    ],
    declarations: [
        OnboardingComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class OnboardingModule { }
