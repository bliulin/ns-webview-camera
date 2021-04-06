import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { DynamicFormFieldOuputModel } from "~/app/credit-request/models/dynamicFormFieldOuputModel";
import { localize } from "nativescript-localize";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DynamicFormOutputModel } from "~/app/credit-request/models/dynamicFormOutputModel";
import { DynamicFormFieldType } from "~/app/credit-request/models/dynamicFormFieldType";
import { DynamicFormFieldRestrictions } from "~/app/credit-request/models/dynamicFormFieldRestrictions";
import { DynamicFormBuilder } from "~/app/credit-request/questionnaire/dynamic-form/dynamic-form-builder";
import { Page } from 'tns-core-modules/ui/page/page';
import { traceDebug, traceError } from "~/app/core/logging/logging-utils";
import { BaseComponent } from "~/app/shared/base.component";
import { RouterExtensions } from 'nativescript-angular';
import { AccountsApiService } from "~/app/accounts/services/accounts-api.service";
import { AccountModel } from "~/app/accounts/models/api/accountModel";
import { NotificationBannerService } from "~/app/shared/services";
import { AccountsStateService } from '../../services/accounts-state.service';
import { ErrorMessages } from "~/app/credit-request/questionnaire/dynamic-form/error-messages";

@Component({
    selector: 'ns-create-new-account',
    templateUrl: './create-new-account.component.html',
    styleUrls: ['./create-new-account.component.scss']
})
export class CreateNewAccountComponent extends BaseComponent implements OnInit {

    public formGroup: FormGroup;
    public currencyField: DynamicFormFieldOuputModel;
    public accountNameField: DynamicFormFieldOuputModel;

    private dynamicForm: DynamicFormOutputModel;

    constructor(public modalDialogService: OmroModalService,
                public routerExtensions: RouterExtensions,
                public vcRef: ViewContainerRef,
                private page: Page,
                private formBuilder: DynamicFormBuilder,
                private stateService: AccountsStateService,
                private api: AccountsApiService,
                private notificationBannerService: NotificationBannerService) {

        super(routerExtensions);

        this.page.actionBarHidden = true;

        this.accountNameField = <DynamicFormFieldOuputModel> {
            fieldId: 'accountName',
            required: true,
            fieldType: DynamicFormFieldType.Textbox,
            regexValidationString: '[a-zA-Z0-9 ]+',
            maxLength: 20
        };

        this.currencyField = <DynamicFormFieldOuputModel> {
            fieldId: 'currency',
            label: localize('Accounts.AccountCard.Label_CurrencyAccount'),
            required: true,
            possibleValues: {
                RON: 'RON',
                EUR: 'EUR'
            },
            defaultValue: 'RON',
            fieldType: DynamicFormFieldType.Dropdown
        };

        this.dynamicForm = <DynamicFormOutputModel> {
            formFields: [this.accountNameField, this.currencyField]
        };

        this.formGroup = this.formBuilder.buildForm(this.dynamicForm);
    }

    ngOnInit() {
    }

    public async onNextTap() {
        if (!this.formGroup.valid) {
            traceDebug('Form not valid.');
            return;
        }
        traceDebug(JSON.stringify(this.getModel()));
        let response = null;

        try {
            traceDebug('Creating new account API request in progres...')
            response = await this.api.createAccount(this.getModel()).toPromise();
            traceDebug('Create account response: ' + JSON.stringify(response));
            this.stateService.reload();
            this.stateService.newAccountDetails$.next(response);
            super.redirectTo('accounts/account-details', true);
        }
        catch (e) {
            traceError('Failed to create account: ' + JSON.stringify(e));
            this.notificationBannerService.showGenericError({
                title: localize('Common.GenericErrorMessage.title'),
                detail: localize('Common.GenericErrorMessage.detail')
            });
        }
    }

    goBack() {
        super.goBack();
    }

    public hasError(fieldName: string): boolean {
        const f = this.formGroup.get(fieldName);
        return f.touched && f.invalid;
    }

    public getErrorMessage(fieldName: string): string {
        return ErrorMessages.getError(fieldName, this.formGroup, this.dynamicForm);
    }

    public onDrowdownTapped(): void {
        const control = this.formGroup.get('accountName');
        control.markAsTouched();
    }

    private getModel(): AccountModel {
        return <AccountModel> {
            name: this.formGroup.value.accountName,
            currencyCode: this.formGroup.value.currency
        };
    }
}
