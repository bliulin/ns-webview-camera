import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { EmailRegRoutingModule } from "./emailreg-routing.module";
import { EmailRegFirstComponent } from "./first-step/first-step.component";
import { SharedModule } from "../shared/shared.module";
import { EmailRegSecondComponent } from "./second-step/second-step.component";
import { EmailRegStateService } from "./email-state.service";
import { EmailRegistrationService } from "./email-registration.service";

@NgModule({
    imports: [
        EmailRegRoutingModule,
        SharedModule
    ],
    declarations: [
        EmailRegFirstComponent,
        EmailRegSecondComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    providers: [
        EmailRegistrationService,
        EmailRegStateService
    ]
})
export class EmailRegModule { }
