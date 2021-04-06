import { Component, OnInit } from '@angular/core';
import localize from 'nativescript-localize';
import { BottomSheetParams } from 'nativescript-material-bottomsheet/angular';
import { Observable } from 'rxjs';
import { LoanDetails } from '../../loan-card/models/loan-details.model';
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
var clipboard = require("nativescript-clipboard");
import { NotificationBannerService } from '../../../../shared/services';

const localizePath: string = 'CreditRequest.Homepage.LoanCard.Details';

@Component({
    selector: 'omro-loan-details',
    templateUrl: './loan-details.component.html',
    styleUrls: ['./loan-details.component.scss']
})
export class LoanDetailsComponent implements OnInit {
    public vm$: Observable<LoanDetails>;
    private IBAN: string;

    constructor(private params: BottomSheetParams, omroModalService: OmroModalService, 
        private notificationBannerService: NotificationBannerService) {
        omroModalService.registerModalCallback(params.closeCallback);
    }

    public ngOnInit(): void {
        this.vm$ = this.params.context;
        this.vm$.subscribe(loan => this.IBAN = loan.IBAN);
    }

    public localization(key: string): string {
        return localize(`${localizePath}.${key}`);
    }

    public onTap() {
        clipboard.setText(this.IBAN);
        this.notificationBannerService.showSuccess("Copiat în clipboard", "Ai copiat cu succes IBAN-ul în clipboard");
    }

    public getLoanStatusMap(isCompletelyPaid: boolean): string {
        return isCompletelyPaid === false ? this.localization('InDesfasurare') : this.localization('Rambursat');
    }

    public close(): void {
        this.params.closeCallback();
    }
}
