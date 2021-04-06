import { Component, OnInit } from '@angular/core';
import { PartnerOutputModel } from '../../models/api';
import { Observable } from 'rxjs';
import { Page } from 'tns-core-modules/ui/page/page';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { TransfersStateService } from '../../services/transfers-state.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { Guid } from 'guid-typescript';
import { AssociatedAccount } from '~/app/transfers/models/api/associatedAccount';

@Component({
    selector: 'omro-partner-details',
    templateUrl: './partner-details.component.html',
    styleUrls: ['./partner-details.component.scss']
})
export class PartnerDetailsComponent extends BaseComponent implements OnInit {
    public vm$: Observable<PartnerOutputModel>;
    public existingAccounts: { [id: string]: string } = {};
    public accountsCurrency: { [id: string]: string } = {};

    private accounts: AssociatedAccount[] = [];

    public selectedAccountFormControl: FormControl;
    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private route: ActivatedRoute,
        private stateService: TransfersStateService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        const id = this.route.snapshot.params.id;
        this.stateService.partnerSelectedSubject.next(id);
        this.vm$ = this.stateService.seletedPartner$.pipe(
            tap((partner) => {
                this.accounts = partner.accounts;
                partner.accounts.forEach((account) => {
                    const key = Guid.create().toString();
                    this.existingAccounts[key] = account.iban;
                    this.accountsCurrency[key] = account.currencyCode;
                });
                this.selectedAccountFormControl = new FormControl(this.initialValue, Validators.required);
            })
        );
    }

    public get initialValue(): string {
        return Object.keys(this.existingAccounts)[0];
    }

    public onClose(): void {
        if (this.routerExtensions.canGoBackToPreviousPage()) {
            super.goBack();
        } else {
            this.navigateToDashboard('transfers', 'slideRight', false);
        }
    }

    public onNewPaymentTap(): void {
        const selectedIban = this.existingAccounts[this.selectedAccountFormControl.value];
        const currentAccount = this.accounts.find((account) => account.iban === selectedIban);
        this.stateService.setPartnerSelectedAccount(currentAccount);
        super.redirectTo('transfers/transfer/external');
    }

    public onAddNewPartnerTap(partner: PartnerOutputModel): void {
        if (!partner.filboAccounts.length) {
            super.redirectTo('transfers/partner/account/add');
        }
        else {
            super.redirectTo('transfers/partner/filbo');
        }
    }
}
