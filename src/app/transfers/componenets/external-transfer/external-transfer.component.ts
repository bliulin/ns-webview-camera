import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { TransfersStateService } from "~/app/transfers/services/transfers-state.service";
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular';
import { BaseComponent } from "~/app/shared/base.component";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { localize } from "nativescript-localize";
import { NotificationBannerService } from "~/app/shared/services";
import { take, takeUntil } from "rxjs/internal/operators";
import { traceError } from "~/app/core/logging/logging-utils";
import { FormGroup } from "@angular/forms";
import { DynamicFormFieldOuputModel } from "~/app/credit-request/models/dynamicFormFieldOuputModel";
import { DynamicFormOutputModel } from "~/app/credit-request/models/dynamicFormOutputModel";
import { DynamicFormBuilder } from "~/app/credit-request/questionnaire/dynamic-form/dynamic-form-builder";
import { Guid } from "guid-typescript";
import { ErrorMessages } from "~/app/credit-request/questionnaire/dynamic-form/error-messages";
import { TransferModel } from "~/app/transfers/models/api/transferModel";
import { Account } from "~/app/accounts/models/api";
import { DynamicFormFieldType } from "~/app/credit-request/models/dynamicFormFieldType";
import { PartnerOutputModel, PaymentModel } from "~/app/transfers/models/api";
import { AssociatedAccount } from "~/app/transfers/models/api/associatedAccount";
import { OmroTextFieldComponent } from "~/app/shared/components";
import { ValidationMessages } from "~/app/transfers/models/validation-messages";

@Component({
    selector: 'ns-external-transfer',
    templateUrl: './external-transfer.component.html',
    styleUrls: ['./external-transfer.component.scss']
})
export class ExternalTransferComponent extends BaseComponent implements OnInit {

    public formGroup: FormGroup;
    public srcAccount: DynamicFormFieldOuputModel;
    public details: DynamicFormFieldOuputModel;
    private dynamicForm: DynamicFormOutputModel;
    private amount: DynamicFormFieldOuputModel;
    private accounts: Account[] = [];
    private readonly nonce: string;

    public beneficiary: PartnerOutputModel;
    public partnerSelectedAccount: AssociatedAccount;

    @ViewChild('amountField', {static: false}) private amountField: OmroTextFieldComponent;

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
        this.transferService.seletedPartner$.pipe(take(1))
            .subscribe(partner => this.beneficiary = partner);
        this.transferService.partnerSelectedAccount$.pipe(take(1))
            .subscribe(account => this.partnerSelectedAccount = account);
    }

    public onClosed(): void {
        super.navigateToDashboard('transfers', 'fade', false);
    }

    public onTransferTapped(): void {
        const postModel = this.getModel();

        if (!this.isValid(postModel)) {
            return;
        }

        this.transferService.addPayment(postModel)
            .subscribe(() => {
                    super.redirectTo('transfers/transfer/external-confirm');
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

    private getModel(): PaymentModel {
        return <PaymentModel>{
            nonce: this.nonce,
            sourceAccountId: this.formGroup.value.srcAccount,
            partnerId: this.beneficiary.id,
            partnerAccountIBAN: this.partnerSelectedAccount.iban,
            partnerAccountCurency: this.partnerSelectedAccount.currencyCode,
            amount: this.formGroup.value.amount,
            details: this.formGroup.value.details
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
        this.amount = {
            fieldId: 'amount',
            label: localize('Transfers.TransferAmount_Label'),
            required: true,
            minimum: 0,
            fieldType: DynamicFormFieldType.Textbox
        };
        this.details = {
            fieldId: 'details',
            label: localize('Transfers.Details_Label'),
            required: true,
            regexValidationString: '[a-zA-Z0-9 ]+',
            maxLength: 50,
            fieldType: DynamicFormFieldType.Textbox
        };

        this.dynamicForm = <DynamicFormOutputModel>{
            formFields: [this.srcAccount, this.amount, this.details]
        };

        this.formGroup = this.formBuilder.buildForm(this.dynamicForm);
    }

    onCloseTapped() {
        this.onClosed();
    }

    onBackTapped() {
        this.goBack();
    }

    onCancelButtonTapped() {
        this.goBack();
    }

    private isValid(postModel: PaymentModel): boolean {
        const amountIsValid = this.validateAmount(postModel);
        return amountIsValid;
    }

    private validateAmount(postModel: PaymentModel): boolean {
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
