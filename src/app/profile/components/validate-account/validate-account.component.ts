import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { Page } from "tns-core-modules/ui/page/page";
import { InfoPageModel } from '~/app/shared/components/informative-page/info-page-model';
import { localize } from "nativescript-localize";
import { MessagingService } from "~/app/core/services/messaging.service";
import { NavigationSource } from "~/app/shared/app.enums";

@Component({
    selector: 'ns-validate-account',
    templateUrl: './validate-account.component.html',
    styleUrls: ['./validate-account.component.scss']
})
export class ValidateAccountComponent implements OnInit {

    vm: InfoPageModel = {};

    constructor(private routerExtensions: RouterExtensions,
                private page: Page,
                private messagingService: MessagingService) {
        this.page.actionBarHidden = true;
    }

    ngOnInit() {
        this.vm = {
            title: localize('Profile.ValidateAccount.Title'),
            imageSource: '~/app/images/new_loan_resolution_manual.svg',
            description: localize('Profile.ValidateAccount.Details'),
            actionButtonText: localize('Common.Continue'),
            showCloseSection: true
        };
    }

    public onButtonTap(): void {
        this.messagingService.setState('kyc-state', {
            source: NavigationSource.UserProfile
        });
        this.routerExtensions.navigate(['/kyc'], {
            transition: {
                name: "fade"
            }
        });
    }

    public close(): void {
        this.routerExtensions.backToPreviousPage();
    }
}
