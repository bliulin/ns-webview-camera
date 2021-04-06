import { Component, OnInit, Input } from '@angular/core';
import { AccountsStateService } from '../../services/accounts-state.service';
import { AccountDetailsOutputModel } from '../../models/api/accountDetailsOutputModel';
import { Observable, combineLatest } from 'rxjs';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { ConfigureChart } from './chart-configuration.service';
import { RoundOneThousandPipe } from '~/app/shared/pipes';
import { Chart } from '../../models/api/chart';
import { map } from 'rxjs/operators';

interface AccountCardViewModel {
    accountDetails: AccountDetailsOutputModel;
    chartData: ChartViewModel;
}

export interface ChartViewModel {
    color: string;
    transactions: Chart[];
}

@Component({
    selector: 'omro-account-card',
    templateUrl: './account-card.component.html',
    styleUrls: ['./account-card.component.scss']
})
export class AccountCardComponent extends BaseComponent implements OnInit {
    @Input() public vm$: Observable<AccountCardViewModel>;
    public chart$: Observable<ChartViewModel>;
    public chartConfiguration: ConfigureChart;

    constructor(
        routerExtensions: RouterExtensions,
        private stateService: AccountsStateService,
        public roundOneThousand: RoundOneThousandPipe
    ) {
        super(routerExtensions);
        this.chartConfiguration = new ConfigureChart(roundOneThousand);
    }

    public ngOnInit(): void {
        this.vm$ = combineLatest([this.stateService.currentAccount$, this.stateService.currentAccountDetails$]).pipe(
            map(
                ([currentAccount, accountDetails]) =>
                    <AccountCardViewModel>{
                        accountDetails: accountDetails,
                        chartData: {
                            color: currentAccount.color,
                            transactions: accountDetails.chartData
                        }
                    }
            )
        );
    }

    public onDetailsTap(): void {
        this.redirectTo('accounts/account-details');
    }

    public onNewTransactioTap(): void {
        super.navigateToDashboard('transfers', 'fade', false)
    }
}
