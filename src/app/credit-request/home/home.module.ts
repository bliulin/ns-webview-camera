import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { HomeRoutingModule } from "./home-routing.module";
import { SharedModule } from "~/app/shared/shared.module";
import { PercentageComponent } from "./percentage/percentage.component";
import { NativeScriptUIGaugeModule } from "nativescript-ui-gauge/angular/gauges-directives";
import { CreditOverviewComponent } from "./credit-overview/credit-overview.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { StageListViewComponent } from "./components/stage-list-view/stage-list-view.component";
import { CreditOverviewPageComponent } from "./credit-overview-page/credit-overview-page.component";
import { SmallCardComponent } from "./components/small-card/small-card.component";
import { LoanActivitiesComponent } from "~/app/credit-request/home/loan-activities/loan-activities.component";
import { EligibleStandardProductComponent } from "./eligible-standard-product/eligible-standard-product.component";
import { LoanCardComponent } from "./loan-card/loan-card.component";
import { HighchartsModule } from "nativescript-ui-highcharts/angular";
import { LoanDetailsComponent } from "./components/loan-details/loan-details.component";
import { SwitchCurrentLoanComponent } from "./components/switch-current-loan/switch-current-loan.component";
import { PercentageModalComponent } from "./eligible-standard-product/percentage-modal/percentage-modal.component";

@NgModule({
    imports: [
        HomeRoutingModule,
        SharedModule,
        NativeScriptUIGaugeModule,
        HighchartsModule
    ],
    declarations: [
        EligibleStandardProductComponent,
        PercentageComponent,
        CreditOverviewComponent,
        HomepageComponent,
        StageListViewComponent,
        CreditOverviewPageComponent,
        SmallCardComponent,
        LoanActivitiesComponent,
        LoanCardComponent,
        LoanDetailsComponent,
        SwitchCurrentLoanComponent,
        PercentageModalComponent
    ],
    entryComponents: [
        LoanDetailsComponent,
        SwitchCurrentLoanComponent,
        PercentageModalComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule {}
