import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { OnboardingComponent } from "./onboarding.component";

const routes: Routes = [
    { path: "", component: OnboardingComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class OnboardingRoutingModule { }
