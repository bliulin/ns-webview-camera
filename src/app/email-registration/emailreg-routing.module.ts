import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { EmailRegFirstComponent } from "./first-step/first-step.component";
import { EmailRegSecondComponent } from "./second-step/second-step.component";

const routes: Routes = [
    { path: "", component: EmailRegFirstComponent },
    { path: "second", component: EmailRegSecondComponent}
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class EmailRegRoutingModule { }
