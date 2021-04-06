import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule, NSEmptyOutletComponent } from "nativescript-angular/router";

import { ProfileComponent } from "./profile.component";
import { SetPinComponent } from "./settings/set-pin/set-pin.component";
import { ConfirmPinComponent } from "./settings/set-pin/confirm/confirm.component";
import { ActivateBiometricComponent } from "./settings/activate-biometric/activate-biometric.component";
import { ChangePinComponent } from "./settings/change-pin/change-pin.component";
import { ConfirmNewPinComponent } from "./settings/change-pin/confirm/confirm.component";
import { CompanyAddComponent } from "./company/company-add/company-add.component";
import { CompanyDetailsComponent } from "./company/company-details/company-details.component";
import { CompanyDynamicFormComponent } from "~/app/profile/components/company-dynamic-form/company-dynamic-form.component";
import { PasswordResetConfirmationComponent } from "~/app/profile/components/password-reset-confirmation/password-reset-confirmation.component";
import { ValidateAccountComponent } from "~/app/profile/components/validate-account/validate-account.component";

const routes: Routes = [
    {path: "", component: ProfileComponent, pathMatch: "full"},
    {
        path: "company",
        children: [
            {
                path: ":id/details",
                component: CompanyDetailsComponent,
                pathMatch: "full"
            },
            {
                path: ":id/dynamic-form",
                component: CompanyDynamicFormComponent,
                pathMatch: "full"
            },
            {
                path: "add",
                component: CompanyAddComponent,
                pathMatch: "full"
            }
        ]
    },
    {
        path: "settings",
        children: [
            {
                path: "",
                component: NSEmptyOutletComponent,
                pathMatch: "full"
            },
            {
                path: "set-pin",
                children: [
                    {path: "set", component: SetPinComponent},
                    {path: "confirm", component: ConfirmPinComponent}
                ]
            },
            {
                path: "change-pin",
                children: [
                    {path: "set", component: ChangePinComponent},
                    {path: "confirm", component: ConfirmNewPinComponent}
                ]
            },
            {
                path: "activate-biometric",
                component: ActivateBiometricComponent
            },
            {
                path: "password-reset-confirmation",
                component: PasswordResetConfirmationComponent
            }
        ]
    },
    {
        path: "validate-account",
        component: ValidateAccountComponent
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ProfileRoutingModule {
}
