import { Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { SkippableUpdateComponent } from "./1001/skippable-update.component";
import { MaintenanceModeComponent } from "./1003/maintenance-mode.component";
import { UrgentUpdateComponent } from "./1002/urgent-update.component";

const routes: Routes = [
    { path: "1001", component: SkippableUpdateComponent },
    { path: "1002", component: UrgentUpdateComponent },
    { path: "1003", component: MaintenanceModeComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class StartupRoutingModule { }