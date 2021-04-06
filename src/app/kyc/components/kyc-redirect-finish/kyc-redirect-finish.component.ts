import { Component, OnInit } from '@angular/core';
import { KycService } from "~/app/kyc/services/kyc.service";
import { Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from 'nativescript-angular';
import { BackButtonHandlerService } from "~/app/kyc/services/back-button-handler.service";
import { CreditRequestService } from '~/app/credit-request/services/credit-request.service';

@Component({
    selector: 'omro-kyc-redirect-finish',
    templateUrl: './kyc-redirect-finish.component.html',
    styleUrls: ['./kyc-redirect-finish.component.scss']
})
export class KycRedirectFinishComponent implements OnInit{

    constructor(private kycService: KycService,
                private routerExtensions: RouterExtensions,
                private page: Page,
                private backButtonHandler: BackButtonHandlerService,
                private creditRequestService: CreditRequestService,) {
        this.page.actionBarHidden = true;
        this.backButtonHandler.supressBackButton();
    }

    ngOnInit() {
        this.kycService.userCompletedKyc(this.creditRequestService.currentProductRequestId, this.kycService.sessiodId);
        this.routerExtensions.navigate(['kyc/kyc-finish'], {
            transition: {
                name: "fade"
            }
        });
    }
}