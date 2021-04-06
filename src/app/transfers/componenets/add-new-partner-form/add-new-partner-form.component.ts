import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import localize from 'nativescript-localize';
import { Field } from '~/app/shared/models';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { CustomValidators } from '~/app/shared/validators/validators.component';
import { PartnerType, CountryCode } from '../../models';
import { TransfersApiService } from '../../services/transfers-api.service';
import { PartnerModel } from '../../models/api';
import { take } from 'rxjs/operators';
import { NotificationBannerService } from '~/app/shared/services';
import { TransfersStateService } from '../../services/transfers-state.service';

const countryPossibleValues: { [countryCode: string]: string } = {
    [CountryCode.RO]: localize('Transfers.AddNewPartner.Form.Country.PossibleValues.RO')
};

const partnerTypePossibleValues: { [partnerType: string]: string } = {
    [PartnerType.PJ]: localize('Transfers.AddNewPartner.Form.PartnerType.PossibleValues.PJ'),
    [PartnerType.PF]: localize('Transfers.AddNewPartner.Form.PartnerType.PossibleValues.PF')
};

@Component({
    selector: 'omro-add-new-partner-form',
    templateUrl: './add-new-partner-form.component.html',
    styleUrls: ['./add-new-partner-form.component.scss']
})
export class AddNewPartnerFormComponent extends BaseComponent implements OnInit {
    public formGroup: FormGroup;
    public countryField: Field = {
        label: localize('Transfers.AddNewPartner.Form.Country.Label'),
        defaultValue: CountryCode.RO,
        possibleValues: countryPossibleValues
    };

    public partnerTypeField: Field = {
        label: localize('Transfers.AddNewPartner.Form.PartnerType.Label'),
        possibleValues: partnerTypePossibleValues
    };

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private formBuilder: FormBuilder,
        public modalDialogService: OmroModalService,
        public vcRef: ViewContainerRef,
        private stateService: TransfersStateService,
        private apiService: TransfersApiService,
        private notificationBannerService: NotificationBannerService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
        this.buildForm();
    }

    public ngOnInit(): void {}

    public get f(): { [key: string]: AbstractControl } {
        return this.formGroup.controls;
    }

    public get uniqueCodeFormControl(): AbstractControl {
        this.handleUniqueCodeField();
        return this.f.uniqueCode;
    }

    public onClosed(): void {
        super.goBack();
    }

    public onOkTapped(): void {
        if (!this.formGroup.valid) {
            this.formGroup.markAllAsTouched();
            return;
        } else {
            this.addPartner();
        }
    }

    public getFieldValidity(key: string): boolean {
        return !this.formGroup.get(key).valid && this.formGroup.get(key).touched;
    }

    public getErrorMessage(key: string): string {
        const fieldErrors = this.formGroup.get(key).errors;
        if (fieldErrors.required) {
            return localize('Transfers.AddNewPartner.Form.ValidationErrors.Required');
        } else if (fieldErrors.validCUI) {
            return localize('Transfers.AddNewPartner.Form.ValidationErrors.InvalidCui');
        }
    }

    private addPartner(): void {
        this.apiService
            .addNewPartner(<PartnerModel>{
                ...this.formGroup.value,
                name: this.formGroup.controls.name.value.trim()

            })
            .pipe(take(1))
            .subscribe(
                (newPartner) => {
                    this.stateService.partnerInsertedSubject.next(newPartner);
                    this.stateService.partnerSelectedSubject.next(newPartner.id);
                    if (newPartner.isFilboCustomer) {
                        super.redirectTo('transfers/partner/filbo');
                    } else {
                        super.redirectTo('transfers/partner/account/add');
                    }
                },
                (error) => this.notificationBannerService.showGenericError()
            );
    }

    private handleUniqueCodeField(): void {
        const uniqueCodeFormControlName = 'uniqueCode';
        if (this.f.partnerType.value === PartnerType.PJ) {
            this.formGroup.addControl(
                uniqueCodeFormControlName,
                new FormControl('', [Validators.required, CustomValidators.validateCUI()])
            );
        } else {
            const partnerTypeFieldIsDisplayed = this.f.uniqueCode || null;
            if (partnerTypeFieldIsDisplayed) {
                this.formGroup.removeControl(uniqueCodeFormControlName);
            }
        }
    }

    private buildForm(): void {
        this.formGroup = this.formBuilder.group({
            name: ['', Validators.required],
            countryCode: CountryCode.RO,
            partnerType: ['', Validators.required]
        });
    }
}
