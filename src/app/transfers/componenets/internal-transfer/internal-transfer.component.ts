import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BaseComponent } from "~/app/shared/base.component";
import { RouterExtensions } from 'nativescript-angular';
import { FormGroup } from "@angular/forms";
import { Page } from 'tns-core-modules/ui/page/page';
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { ErrorMessages } from "~/app/credit-request/questionnaire/dynamic-form/error-messages";
import { DynamicFormFieldOuputModel } from "~/app/credit-request/models/dynamicFormFieldOuputModel";
import { localize } from "nativescript-localize";
import { DynamicFormFieldType } from "~/app/credit-request/models/dynamicFormFieldType";
import { TransfersStateService } from "~/app/transfers/services/transfers-state.service";
import { takeUntil } from "rxjs/internal/operators";
import { Account } from "~/app/accounts/models/api";
import { DynamicFormOutputModel } from "~/app/credit-request/models/dynamicFormOutputModel";
import { DynamicFormFieldRestrictions } from '~/app/credit-request/models/dynamicFormFieldRestrictions';
import { DynamicFormBuilder } from "~/app/credit-request/questionnaire/dynamic-form/dynamic-form-builder";
import { TransferModel } from "~/app/transfers/models/api/transferModel";
import { Guid } from "guid-typescript";
import { NotificationBannerService } from "~/app/shared/services";
import { traceError } from "~/app/core/logging/logging-utils";
import { ValidationMessages } from "~/app/transfers/models/validation-messages";

@Component({
    selector: 'ns-internal-transfer',
    templateUrl: './internal-transfer.component.html',
    styleUrls: ['./internal-transfer.component.scss']
})
export class InternalTransferComponent extends BaseComponent implements OnInit {

    public formGroup: FormGroup;
    public srcAccount: DynamicFormFieldOuputModel;
    public destAccount: DynamicFormFieldOuputModel;
    private dynamicForm: DynamicFormOutputModel;
    private amount: DynamicFormFieldOuputModel;
    private accounts: Account[] = [];
    private readonly nonce: string;

    constructor(router: RouterExtensions,
                public vcRef: ViewContainerRef,
                private page: Page,
                public modalDialogService: OmroModalService,
                private transferService: TransfersStateService,
                private formBuilder: DynamicFormBuilder,
                private notificationBannerService: NotificationBannerService) {
        super(router);
        this.page.actionBarHidden = true;
        this.nonce = Guid.create().toString();
    }

    public ngOnInit(): void {
        this.transferService.accounts$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(accounts => {
                this.accounts = accounts;
                this.createFields(accounts);
            });
    }

    public onClosed(): void {
        super.goBack();
    }

    public onTransferTapped(): void {
        const postModel = this.getModel();

        if (!this.isValid(postModel)) {
            return;
        }

        this.transferService.addTransfer(postModel)
            .subscribe(() => {
                    super.redirectTo('transfers/transfer/internal-confirm');
                },
                error => {
                    traceError('Failed to add transfer! ' + error);
                    this.notificationBannerService.showGenericError({
                        title: localize('Common.GenericErrorMessage.title'),
                        detail: localize('Common.GenericErrorMessage.detail')
                    });
                });
    }

    public hasError(fieldName: string): boolean {
        const f = this.formGroup.get(fieldName);
        return f.touched && f.invalid;
    }

    public getErrorMessage(fieldName: string): string {
        const field = this.formGroup.get(fieldName);
        if (field.valid) {
            return '';
        }
        const [firstError] = Object.keys(field.errors);

        let message = this.getErrorMessageFromFieldAndErrorType(fieldName, firstError);

        if (!message) {
            message = ErrorMessages.getError(fieldName, this.formGroup, this.dynamicForm);
        }

        return message;
    }

    public onCancelButtonTapped(): void {
        this.onClosed();
    }

    private getModel(): TransferModel {
        return <TransferModel>{
            sourceAccountId: this.formGroup.value.srcAccount,
            destinationAccountId: this.formGroup.value.destAccount,
            amount: this.formGroup.value.amount,
            nonce: this.nonce
        };
    }

    private createFields(accounts: Account[]): void {
        const accountChoices = {};
        accounts.forEach(account => {
            accountChoices[account.id] = `${account.workingBalance} ${account.name}`;
        });
        this.srcAccount = {
            fieldId: 'srcAccount',
            label: localize('Transfers.TransferFromAccount_Label'),
            required: true,
            possibleValues: accountChoices,
            fieldType: DynamicFormFieldType.Dropdown
        };
        this.destAccount = {
            fieldId: 'destAccount',
            label: localize('Transfers.TransferToAccount_Label'),
            required: true,
            possibleValues: accountChoices,
            fieldType: DynamicFormFieldType.Dropdown
        };
        this.amount = {
            fieldId: 'amount',
            label: localize('Transfers.TransferAmount_Label'),
            required: true,
            restrictions: DynamicFormFieldRestrictions.Digits,
            fieldType: DynamicFormFieldType.Textbox,
            minimum: 0
        };

        this.dynamicForm = <DynamicFormOutputModel>{
            formFields: [this.srcAccount, this.destAccount, this.amount]
        };

        this.formGroup = this.formBuilder.buildForm(this.dynamicForm);
    }

    private isValid(postModel: TransferModel): boolean {
        const amountIsValid = this.validateAmount(postModel);
        return amountIsValid;
    }

    private validateAmount(postModel: TransferModel): boolean {
        const selectedAccount = this.accounts.find(account => account.id === postModel.sourceAccountId);
        const isAmountValid = (postModel.amount > 0 && postModel.amount <= selectedAccount.workingBalance);

        if (!isAmountValid) {
            const control = this.formGroup.get('amount');
            control.markAsTouched();
            control.setErrors({max: true});
        }

        return isAmountValid;
    }

    private getErrorMessageFromFieldAndErrorType(fieldName: string, errorName: any): string {
        if (!(ValidationMessages[fieldName] && ValidationMessages[fieldName][errorName])) {
            return null;
        }
        return ValidationMessages[fieldName][errorName];
    }
}
