import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular";
import { FirstStepComponent } from "./first-step/first-step.component";
import { SharedModule } from "~/app/shared/shared.module";
import { PrefixPickerComponent } from "./components/prefix-picker/prefix-picker.component";
import { PhoneRegistrationApiService } from "~/app/phone-registration/phone-registration-api.service";
import { PhoneRegistrationStateService } from "~/app/phone-registration/phone-registration-state.service";
import { SecondStepComponent } from "./second-step/second-step.component";
import { ThirdStepComponent } from "./third-step/third-step.component";
import { CancelPopupComponent } from "./components/cancel-popup/cancel-popup.component";
import { PhoneRegistrationMockService } from "~/app/phone-registration/phone-registration-mock.service";

const routes = [
    { path: "", component: FirstStepComponent },
    { path: "second", component: SecondStepComponent },
    { path: "third", component: ThirdStepComponent }
];

@NgModule({
    declarations: [
        FirstStepComponent,
        PrefixPickerComponent,
        SecondStepComponent,
        ThirdStepComponent,
        CancelPopupComponent
    ],
    imports: [
        NativeScriptRouterModule.forChild(routes),
        SharedModule
    ],
    providers: [PhoneRegistrationStateService, {provide:PhoneRegistrationApiService,useClass:PhoneRegistrationApiService}],
    entryComponents: [PrefixPickerComponent, CancelPopupComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class PhoneRegistrationModule {}
