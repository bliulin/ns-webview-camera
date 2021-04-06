import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { HomepageComponent } from "~/app/credit-request/home/homepage/homepage.component";
import { CreditOverviewPageComponent } from "~/app/credit-request/home/credit-overview-page/credit-overview-page.component";

const routes: Routes = [
    {
        path: "",
        component: HomepageComponent,
        pathMatch: "full"
    },
    {
        path: "credit-overview/:productRequestId",
        component: CreditOverviewPageComponent
    }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class HomeRoutingModule {}
