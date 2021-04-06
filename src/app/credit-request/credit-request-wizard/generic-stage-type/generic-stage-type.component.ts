import { Component, OnInit, Input } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page';
import { RouterExtensions } from 'nativescript-angular';
import { FormControl, Validators } from '@angular/forms';
import { FlowStageGenericOutputModel } from '~/app/credit-request/models/flowStageGenericOutputModel';
import { CreditRequestService } from '~/app/credit-request/services/credit-request.service';
import { NotificationBannerService } from '~/app/shared/services';
import { MessagingService } from "~/app/core/services/messaging.service";
import { NavigationSource } from "~/app/shared/app.enums";

@Component({
    selector: 'omro-generic-stage-type',
    templateUrl: './generic-stage-type.component.html',
    styleUrls: ['./generic-stage-type.component.scss']
})
export class GenericStageTypeComponent implements OnInit {
    @Input() public genericStage: FlowStageGenericOutputModel;

    public checkbox: FormControl;

    constructor(
        private page: Page,
        private routerExtensions: RouterExtensions,
        private creditRequestService: CreditRequestService,
        private notificationBannerService: NotificationBannerService,
        private messagingService: MessagingService
    ) {
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        if (this.needsUserApproval()) {
            this.checkbox = new FormControl(false, [Validators.requiredTrue]);
        }
    }

    public needsUserApproval(): boolean {
        return this.genericStage.mainAction === 'UserApproval' && !!this.genericStage.userApprovalCheckbox;
    }

    public toggleCheckbox(): void {
        const checkboxCurrentValue = this.checkbox.value;
        this.checkbox.setValue(!checkboxCurrentValue);
    }

    public onButtonTap(): void {
        switch (this.genericStage.mainAction) {
            case 'NoAction':
                this.close();
                break;
            case 'UserKYC':
                this.redirectToKyc();
                break;
            case 'UserApproval':
                this.sendUserApproval();
                break;
            default:
                this.close();
                break;
        }
    }

    public close(): void {
        this.routerExtensions.backToPreviousPage();
    }

    private sendUserApproval(): void {
        this.creditRequestService
            .sendApproval()
            .then(response => (response ? this.close() : this.notificationBannerService.showGenericError()));
    }

    private redirectToKyc(): void {
        this.messagingService.setState('kyc-state', {
            source: NavigationSource.ProductRequest
        });
        this.routerExtensions.navigate(['/kyc'], {
            transition: {
                name: "fade"
            }
        });
    }
}
