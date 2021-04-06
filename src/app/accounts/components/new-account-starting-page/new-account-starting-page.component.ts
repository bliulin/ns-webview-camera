import { Component, OnInit, Input } from '@angular/core';
import { device } from '@nativescript/core/platform';
import { Page } from 'tns-core-modules/ui/page/page';
import { EligibleCurrency } from '../../models/api';
import { RouterExtensions } from 'nativescript-angular';
import { LocaleService } from "~/app/core/services/locale.service";
import { BaseComponent } from "~/app/shared/base.component";

@Component({
    selector: 'omro-new-account-starting-page',
    templateUrl: './new-account-starting-page.component.html',
    styleUrls: ['./new-account-starting-page.component.scss']
})
export class NewAccountStartingPageComponent extends BaseComponent implements OnInit {
    private locale: string;

    @Input() private eligiblesCurrenciesVm: EligibleCurrency;
    public isTablet: boolean = device.deviceType === 'Tablet';

    constructor(private page: Page,
                public routerExtensions: RouterExtensions,
                private localeService: LocaleService) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
        this.locale = localeService.currentLocale.substring(0, 2);
    }

    public get isEligibleForAccount(): boolean {
        return this.eligiblesCurrenciesVm.currencyCodes.length > 0;
    }

    ngOnInit() {
    }

    onValidateTap() {
        this.redirectTo('accounts/create-account');
    }

    onOkTapped() {
        this.routerExtensions.backToPreviousPage();
    }

    public localizeImg(imgSrc: string) {
        return `${imgSrc}_${this.locale}`;
    }
}
