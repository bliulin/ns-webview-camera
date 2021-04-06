import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { AddedPaymentOutputModel } from "~/app/transfers/models/api/addedPaymentOutputModel";
import { TransfersStateService } from "~/app/transfers/services/transfers-state.service";
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular';
import { take } from "rxjs/internal/operators";
import { ConfirmedPaymentOutputModel, PartnerOutputModel } from "~/app/transfers/models/api";
import { DialogResult } from "~/app/shared/app.enums";
import { traceDebug, traceError } from "~/app/core/logging/logging-utils";
import { localize } from "nativescript-localize";
import { BottomDialogButtonType } from "~/app/shared/models/bottom-dialog.config";
import { TransfersApiService } from "~/app/transfers/services/transfers-api.service";
import { NotificationBannerService } from "~/app/shared/services";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { ApplicationService } from "~/app/core/services/application.service";
import { TransferBaseComponent } from "~/app/transfers/componenets/transfer-base.component";
import { Transaction } from "~/app/accounts/models/api";
import { MessagingService } from "~/app/core/services/messaging.service";

@Component({
    selector: 'ns-external-transfer-confirm',
    templateUrl: './external-transfer-confirm.component.html',
    styleUrls: ['./external-transfer-confirm.component.scss']
})
export class ExternalTransferConfirmComponent extends TransferBaseComponent implements OnInit {

    public payment: AddedPaymentOutputModel;
    private beneficiary: PartnerOutputModel;

    constructor(private transferStateService: TransfersStateService,
                private transferHttpService: TransfersApiService,
                protected page: Page,
                protected router: RouterExtensions,
                private notificationBannerService: NotificationBannerService,
                private modalDialogService: OmroModalService,
                public vcRef: ViewContainerRef,
                application: ApplicationService,
                private messagingService: MessagingService) {
        super(page, router, application);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.transferStateService.addedPayment$
            .pipe(take(1))
            .subscribe(payment => {
                this.payment = payment;
                traceDebug(JSON.stringify(payment));
            });
        this.transferStateService.seletedPartner$.pipe(take(1))
            .subscribe(partner => this.beneficiary = partner);
    }

    public onConfirmTapped(): void {
        this.application.authorizeAction().subscribe(
            () => this.performPaymentConfirmation(),
            () => {
            }
        );
    }

    public async onBackTapped(): Promise<void> {
        return this.navigateBack();
    }

    public async onCancelButtonTapped(): Promise<void> {
        await this.cancelTransfer();
    }

    public async onCloseTapped(): Promise<void> {
        await this.cancelTransfer();
    }

    protected async navigateBack(): Promise<void> {
        const success: boolean = await this.performTransferCancellation();
        if (!!success) {
            this.goBack();
        }
    }

    private async cancelTransfer(): Promise<void> {
        const result = await this.confirm();
        if (result === DialogResult.Yes) {
            traceDebug('Transaction ID: ' + this.payment.transactionId);
            const success: boolean = await this.performTransferCancellation();
            if (!!success) {
                super.redirectTo('transfers', false, 'fade');
            }
        }
    }

    private async performTransferCancellation(): Promise<boolean> {
        try {
            await this.transferHttpService.cancelPayment({
                transactionId: this.payment.transactionId
            }).toPromise();
            return true;
        } catch (error) {
            traceError('Failed to cancel payment! ' + error);
            this.notificationBannerService.showGenericError({
                title: localize('Common.GenericErrorMessage.title'),
                detail: localize('Common.GenericErrorMessage.detail')
            });
        }
        return false;
    }

    private confirm(): Promise<DialogResult> {
        return this.modalDialogService.showYesNoDialog({
            viewContainerRef: this.vcRef,
            title: localize('ProductRequest.AreYouSure'),
            message: localize('Transfers.ConfirmationQuestion'),
            yesButtonType: BottomDialogButtonType.Error
        }).toPromise();
    }

    private performPaymentConfirmation(): void {
        this.transferStateService.confirmPayment({
            transactionId: this.payment.transactionId
        }).subscribe((result: ConfirmedPaymentOutputModel) => {
            let transaction: Transaction = <Transaction> {};
            Object.assign(transaction, result);
            this.messagingService.raiseEvent<Transaction>("TransactionCreated", transaction);
            super.redirectTo(`accounts/transaction/${result.transactionId}/details`, true);
        }, error => {
            traceError('Failed to confirm transaction! ' + error);
            this.notificationBannerService.showGenericError({
                title: localize('Common.GenericErrorMessage.title'),
                detail: localize('Common.GenericErrorMessage.detail')
            });
        });
    }
}
