import { Component, Input, ViewContainerRef } from '@angular/core';
import { LoansModuleLoan } from '../../models/loansModuleLoan';
import { RoundOneThousandPipe } from '~/app/shared/pipes';
import { BottomSheetService, BottomSheetOptions } from 'nativescript-material-bottomsheet/angular';
import { LoanDetailsComponent } from '../components/loan-details/loan-details.component';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoanDetails } from './models/loan-details.model';
import { ConfigureChart } from './chart-configuration.service';
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsDashboardEvents } from "~/app/core/models/app-insights-events";
import { RouterExtensions } from 'nativescript-angular';

@Component({
    moduleId: module.id,
    selector: 'omro-loan-card',
    templateUrl: './loan-card.component.html',
    styleUrls: ['./loan-card.component.scss']
})
export class LoanCardComponent {
    @Input() public loan: LoansModuleLoan;

    private chartConfiguration: ConfigureChart;

    constructor(
        public roundOneThousand: RoundOneThousandPipe,
        private omroModalService: OmroModalService,
        private containerRef: ViewContainerRef,
        private analyticsService: AnalyticsService,
        private routerExtensions: RouterExtensions
    ) {
        this.chartConfiguration = new ConfigureChart(roundOneThousand);
    }

    public get isWarningAlert(): boolean {
        return this.loan.alert.alertType === 'Warning';
    }

    public get chartConfigString(): string {
        if (!this.loan) {
            return null;
        } else {
            return this.chartConfiguration.getConfig(this.loan);
        }
    }

    public onDetailsTap(): void {
        this.analyticsService.trackEvent(AppInsightsDashboardEvents.DashboardLoanCardShowDetails, this.routerExtensions.router.url)
        this.showLoanDetails();
    }

    private showLoanDetails(): void {
        const options: BottomSheetOptions = {
            viewContainerRef: this.containerRef,
            context: of(this.loan).pipe(
                map(
                    loan =>
                        <LoanDetails>{
                            //purpose: loan.purpose,
                            totalAmount: loan.totalAmount,
                            currencyDisplayName: loan.currencyDisplayName,
                            totalLeftAmount: loan.totalLeftAmount,
                            interestRate: loan.interestRate,
                            months: loan.months,
                            nextDueDate: loan.nextDueDate,
                            isCompletelyPaid: loan.isCompletelyPaid,
                            IBAN: loan.omroIban,
                            bank: loan.omroBank
                        }
                )
            ),
            transparent: true
        };

        this.omroModalService.showBottomSheet(LoanDetailsComponent, options).subscribe(data => console.log(data));
    }
}
