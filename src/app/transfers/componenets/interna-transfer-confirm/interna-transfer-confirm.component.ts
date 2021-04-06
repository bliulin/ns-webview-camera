import { Component, ViewContainerRef } from '@angular/core';
import { TransfersStateService } from "~/app/transfers/services/transfers-state.service";
import { Observable } from "rxjs";
import { AddedTransferOutputModel } from "~/app/transfers/models/api/addedTransferOutputModel";
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular';
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { DialogResult } from "~/app/shared/app.enums";
import { localize } from "nativescript-localize";
import { BottomDialogButtonType } from "~/app/shared/models/bottom-dialog.config";
import { TransfersApiService } from "~/app/transfers/services/transfers-api.service";
import { NotificationBannerService } from "~/app/shared/services";
import { take } from "rxjs/internal/operators";
import { traceDebug, traceError } from "~/app/core/logging/logging-utils";
import { TransferBaseComponent } from "~/app/transfers/componenets/transfer-base.component";
import { ConfirmedTransferOutputModel } from "~/app/transfers/models/api/confirmedTransferOutputModel";
import { MessagingService } from "~/app/core/services/messaging.service";
import { Transaction } from "~/app/accounts/models/api";

@Component({
    selector: 'ns-interna-transfer-confirm',
    templateUrl: './interna-transfer-confirm.component.html',
    styleUrls: ['./interna-transfer-confirm.component.scss']
})
export class InternaTransferConfirmComponent extends TransferBaseComponent {

    public transfer$: Observable<AddedTransferOutputModel>;
    private transactionId: string;

    constructor(private transferService: TransfersStateService,
                protected page: Page,
                protected router: RouterExtensions,
                public modalDialogService: OmroModalService,
                public vcRef: ViewContainerRef,
                private transferHttpService: TransfersApiService,
                private notificationBannerService: NotificationBannerService,
                private messagingService: MessagingService) {
        super(page, router);
        this.transfer$ = this.transferService.addedTransfer$;
        this.transfer$.pipe(take(1)).subscribe(t => {
            this.transactionId = t.transactionId;
        });
    }

    public async onBackTapped(): Promise<void> {
        return this.navigateBack();
    }

    public async onCloseTapped(): Promise<void> {
        await this.cancelTransfer();
    }

    public async onCancelButtonTapped(): Promise<void> {
        await this.cancelTransfer();
    }

    public onConfirmTapped(): void {
        this.transferService.confirmTransfer({
            transactionId: this.transactionId
        }).subscribe((result: ConfirmedTransferOutputModel) => {
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

    protected async navigateBack(): Promise<void> {
        const success: boolean = await this.performTransferCancellation();
        if (!!success) {
            super.goBack();
        }
    }

    private async cancelTransfer(): Promise<void> {
        const result = await this.confirm();
        if (result === DialogResult.Yes) {
            traceDebug('Transaction ID: ' + this.transactionId);
            const success: boolean = await this.performTransferCancellation();
            if (!!success) {
                super.redirectTo('transfers', false, 'fade');
            }
        }
    }

    private async performTransferCancellation(): Promise<boolean> {
        try {
            await this.transferHttpService.cancelTransfer({
                transactionId: this.transactionId
            }).toPromise();
            return true;
        } catch (error) {
            traceError('Failed to cancel transaction! ' + error);
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
}
