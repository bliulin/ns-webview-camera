import { BaseComponent } from "~/app/shared/base.component";
import { Component } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { Page } from "tns-core-modules/ui/page/page";
import { KycService } from "~/app/kyc/services/kyc.service";

@Component({
    selector: 'omro-kyc-plaholder',
    templateUrl: './kyc-placeholder-modal.component.html',
    styleUrls: ['./kyc-placeholder-modal.component.scss']
})
export class KycPlaceholderModalComponent extends BaseComponent{
    constructor(public routerExtensions: RouterExtensions,
        private page: Page,
        private kycService: KycService
        ){
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public async goBack(): Promise<void> { 
        const redirectUrl = this.kycService.sourceUrl;
        this.routerExtensions.navigate(['/dashboard', {outlets: {dashboard: [redirectUrl]}}], {
            transition: {
                name: "fade"
            }
        });
    }
}