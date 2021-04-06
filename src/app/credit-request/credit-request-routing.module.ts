import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { StandardProductOverviewComponent } from "./standard-product-overview/standard-product-overview.component";
import { CheckOfferStatusComponent } from "./credit-request-wizard/check-offer-status/check-offer-status.component";
import { InitiateCreditRequestComponent } from "~/app/credit-request/credit-request-wizard/initiate-credit-request/initiate-credit-request.component";
import { StageContainerComponent } from "~/app/credit-request/stage-container/stage-container.component";

const routes: Routes = [
    {
        path: "",
        loadChildren: () =>
            import("~/app/credit-request/home/home.module").then(
                m => m.HomeModule
            )
    },
    {
        path: "uvp",
        component: StandardProductOverviewComponent,
        pathMatch: "full"
    },
    {
        path: "wizard",
        children: [
            {
                path: "initiate",
                component: InitiateCreditRequestComponent
            }
            ,
            {
                path: "check-offer",
                component: CheckOfferStatusComponent
            }
        ]
    },
    {
        path: 'stage-details/:stageType',
        component: StageContainerComponent,
        children: [
            {
                path: 'upload/:uploadFileSetId',
                redirectTo: '/upload-documents/upload/:uploadFileSetId'
            }
        ]
    }];

@NgModule({
    declarations: [],
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class CreditRequestRoutingModule {
}
