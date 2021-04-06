import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { AppStatusHttpService } from "./app-status-http.service";
import { SharedModule } from "../shared/shared.module";
import { AppStatusComponent } from "./app-status.component";
import { StartupRoutingModule } from "./startup-routing.module";
import { SkippableUpdateComponent } from "./1001/skippable-update.component";
import { MaintenanceModeComponent } from "./1003/maintenance-mode.component";
import { UrgentUpdateComponent } from "./1002/urgent-update.component";

@NgModule({
    imports: [SharedModule, StartupRoutingModule],
    providers: [AppStatusHttpService],
    declarations: [
        AppStatusComponent, 
        SkippableUpdateComponent,
        UrgentUpdateComponent,
        MaintenanceModeComponent
    ],
    exports: [AppStatusComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class StartupModule {}