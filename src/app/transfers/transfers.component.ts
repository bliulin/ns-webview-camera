import { Component, OnInit } from '@angular/core';
import { TransfersService } from './transfers.service';
import { Page } from 'tns-core-modules/ui/page/page';
import { TransfersStateService } from './services/transfers-state.service';
import { Observable, combineLatest, throwError } from 'rxjs';
import { Account } from '~/app/accounts/models/api';
import { BaseComponent } from '../shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { PartnerOutputModel } from './models/api';
import { map, catchError, retryWhen } from 'rxjs/operators';
import { NotificationBannerService } from '../shared/services';
import { ApplicationService } from '../core/services/application.service';

interface TransfersViewModel {
    partners: PartnerOutputModel;
    accounts: Account[];
}

@Component({
    selector: 'omro-transfers',
    templateUrl: './transfers.component.html',
    styleUrls: ['./transfers.component.scss'],
    providers: [TransfersService]
})
export class TransfersComponent extends BaseComponent implements OnInit {
    public vm$: Observable<TransfersViewModel>;
    constructor(
        routerExtensions: RouterExtensions,
        application: ApplicationService,
        private page: Page,
        private stateService: TransfersStateService,
        private notificationService: NotificationBannerService
    ) {
        super(routerExtensions, application);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.stateService.invalidateCache();
        this.vm$ = combineLatest([this.stateService.partnersVM$, this.stateService.accounts$])
            .pipe(
                map(([partners, accounts]) => ({
                    partners,
                    accounts
                }))
            )
            .pipe(catchError((err) => this.handleError(err)))
            .pipe(retryWhen(this.getNoConnectivityRetryStrategy()));
    }

    public onAddNewPartnerTap(): void {
        super.redirectTo('transfers/partner/add');
    }

    public onTransferBetweenMyAccountsTapped(): void {
        super.redirectTo('transfers/transfer/internal');
    }

    private handleError(err: any) {
        this.notificationService.showGenericError(err);
        return throwError(err);
    }
}
