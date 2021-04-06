import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '~/app/shared/base.component';
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular';
import { Field } from '~/app/shared/models';
import { CurrencyCode } from '../../models';
import localize from 'nativescript-localize';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { TransfersStateService } from '../../services/transfers-state.service';
import { PartnerOutputModel, PartnerAccountsModel, PartnerAccount } from '../../models/api';
import { Observable } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { CustomValidators } from '~/app/shared/validators/validators.component';
import { TransfersApiService } from '../../services/transfers-api.service';
import { NotificationBannerService } from '~/app/shared/services';

const accountCurrencyCodePossibleValues: { [currencyCode: string]: string } = {
    [CurrencyCode.RON]: localize('Transfers.AddNewPartner.AddNewAccount.Form.Currency.PossibleValues.RON')
};

@Component({
    selector: 'omro-add-new-account-form',
    templateUrl: './add-new-account-form.component.html',
    styleUrls: ['./add-new-account-form.component.scss']
})
export class AddNewAccountFormComponent extends BaseComponent implements OnInit {
    public vm$: Observable<PartnerOutputModel>;
    public formGroup: FormGroup;

    public currencyField: Field = {
        label: localize('Transfers.AddNewPartner.AddNewAccount.Form.Currency.DisplayName'),
        defaultValue: CurrencyCode.RON,
        possibleValues: accountCurrencyCodePossibleValues
    };
    constructor(
        routerExtensions: RouterExtensions,
        public modalDialogService: OmroModalService,
        public vcRef: ViewContainerRef,
        private page: Page,
        private formBuilder: FormBuilder,
        private stateService: TransfersStateService,
        private apiService: TransfersApiService,
        private notificationBannerService: NotificationBannerService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.vm$ = this.stateService.seletedPartner$.pipe(
            filter((selectedPartner) => !!selectedPartner),
            tap((selectedPartner) => this.buildForm(selectedPartner.id))
        );
    }

    public onClosed(): void {
        if (this.routerExtensions.canGoBackToPreviousPage()) {
            super.goBack();
        } else {
            super.navigateToDashboard('transfers', 'slideRight', false);
        }
    }

    public getFieldValidity(key: string): boolean {
        return !this.formGroup.get(key).valid && this.formGroup.get(key).touched;
    }

    public getErrorMessage(key: string): string {
        const fieldErrors = this.formGroup.get(key).errors;
        if (fieldErrors.required) {
            return localize('Transfers.AddNewPartner.AddNewAccount.Form.ValidationErrors.Required');
        } else if (fieldErrors.validIBAN) {
            return localize('Transfers.AddNewPartner.AddNewAccount.Form.ValidationErrors.InvalidIban');
        }
    }

    public onButtonTap(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        }
        const formValues = this.formGroup.controls;
        this.apiService
            .addAccountsToPartner(<PartnerAccountsModel>{
                partnerId: formValues.partnerId.value,
                accounts: [
                    <PartnerAccount>{
                        iban: formValues.iban.value,
                        currencyCode: formValues.currencyCode.value
                    }
                ]
            })
            .subscribe(
                (partner) => {
                    this.stateService.partnerInsertedSubject.next(partner);
                    this.stateService.partnerSelectedSubject.next(partner.id);
                    super.redirectTo(`transfers/partner/${partner.id}/details`, true);
                },
                (error) => this.notificationBannerService.showError(error)
            );
    }
    private buildForm(partnerId: string): void {
        this.formGroup = this.formBuilder.group({
            partnerId: partnerId,
            iban: ['', [Validators.required, CustomValidators.validateIBAN()]],
            currencyCode: CurrencyCode.RON
        });
    }
}
