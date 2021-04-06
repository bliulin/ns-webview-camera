import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { TransfersStateService } from '../../services/transfers-state.service';
import { PartnerOutputModel, PartnerAccountsModel } from '../../models/api';
import { Observable } from 'rxjs';
import { TransfersApiService } from '../../services/transfers-api.service';
import { NotificationBannerService } from '~/app/shared/services';

@Component({
    selector: 'omro-filbo-partner-association',
    templateUrl: './filbo-partner-association.component.html',
    styleUrls: ['./filbo-partner-association.component.scss']
})
export class FilboPartnerAssociationComponent extends BaseComponent implements OnInit {
    public vm$: Observable<PartnerOutputModel>;

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private stateService: TransfersStateService,
        private apiService: TransfersApiService,
        private notificationBannerService: NotificationBannerService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.vm$ = this.stateService.seletedPartner$;
    }

    public onAddNewAccountTap(): void {
        super.redirectTo('transfers/partner/account/add');
    }

    public onAssociateAccountTap(selectedPartner: PartnerOutputModel): void {
        this.apiService
            .addAccountsToPartner(<PartnerAccountsModel>{
                partnerId: selectedPartner.id,
                accounts: [...selectedPartner.filboAccounts]
            })
            .subscribe(
                (partner) => {
                    this.stateService.partnerInsertedSubject.next(partner);
                    this.stateService.partnerSelectedSubject.next(partner.id);
                    super.redirectTo(`transfers/partner/${partner.id}/details`, true);
                },
                (error) => this.notificationBannerService.showError(error)
            );
    }

    public onClosed(): void {
        super.navigateToDashboard('transfers', 'fade', false);
    }
}
