import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TransfersStateService } from '../../services/transfers-state.service';
import { PartnerOutputModel } from '../../models/api';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';

enum IbanUiState {
    ibanIsDisplayed = 0,
    isFilboParner = 1,
    hasMultimpleAccountsAssociated = 2
}

@Component({
    selector: 'omro-business-partners-card',
    templateUrl: './business-partners-card.component.html',
    styleUrls: ['./business-partners-card.component.scss']
})
export class BusinessPartnersCardComponent extends BaseComponent implements OnInit {
    public vm$: Observable<PartnerOutputModel[]>;
    public ibanUiState: typeof IbanUiState = IbanUiState;
    constructor(routerExtensions: RouterExtensions, private stateService: TransfersStateService) {
        super(routerExtensions);
    }

    public ngOnInit(): void {
        this.vm$ = this.stateService.partners$;
    }

    public getIbanUiState(partner: PartnerOutputModel): IbanUiState {
        if (!partner.hasFilboAccounts) {
            if (partner.accounts.length === 1) {
                return this.ibanUiState.ibanIsDisplayed;
            } else if (partner.accounts.length > 1) {
                return this.ibanUiState.hasMultimpleAccountsAssociated;
            }
        }
        if (partner.hasFilboAccounts) {
            return this.ibanUiState.isFilboParner;
        }
    }

    public onPartnerTap(partnerId: string): void {
        super.redirectTo(`transfers/partner/${partnerId}/details`);
    }
}
