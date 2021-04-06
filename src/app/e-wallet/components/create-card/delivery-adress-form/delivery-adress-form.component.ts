import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Page } from 'tns-core-modules/ui/page/page';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { DeliveryAdressFormLabelsDictionary } from '../../../models';
import { CreateCardService } from '../create-card.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Address } from '~/app/e-wallet/models/api';
import localize from 'nativescript-localize';

@Component({
    selector: 'omro-delivery-adress-form',
    templateUrl: './delivery-adress-form.component.html',
    styleUrls: ['./delivery-adress-form.component.scss']
})
export class DeliveryAdressFormComponent extends BaseComponent implements OnInit {
    public vm$: Observable<Address>;
    public formGroup: FormGroup;

    public labels: typeof DeliveryAdressFormLabelsDictionary = DeliveryAdressFormLabelsDictionary;

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private formBuilder: FormBuilder,
        private cardCreationService: CreateCardService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }
    public ngOnInit(): void {
        this.vm$ = this.cardCreationService.adressVM$.pipe(
            tap((lastAdress) =>
                this.buildForm().then(() => {
                    if (lastAdress) {
                        this.markAllControlsAsTouched();
                    }
                    this.formGroup.patchValue(lastAdress);
                })
            )
        );
    }

    public get formControls(): string[] {
        return Object.keys(this.formGroup.controls);
    }
    public onReturnPress(fieldIndex: number): void {
        if (fieldIndex === this.formControls.length - 1) {
            this.onNextTap();
        } else {
            return;
        }
    }

    public getFieldValidity(key: string): boolean {
        return !this.formGroup.get(key).valid && this.formGroup.get(key).touched;
    }

    public getErrorMessage(key: string): string {
        const fieldErrors = this.formGroup.get(key).errors;
        if (fieldErrors.required) {
            return localize('EWallet.Homepage.NoCardsAdded.NewCard.DeliveryAdress.ValidationErrors.Required');
        } else if (fieldErrors.maxlength) {
            return localize('EWallet.Homepage.NoCardsAdded.NewCard.DeliveryAdress.ValidationErrors.MaxLength');
        }
    }

    public goBack(): void {
        this.redirectTo('e-wallet/card/pin/set', true);
    }

    public onNextTap(): void {
        if (!this.formGroup.valid) {
            return;
        }
        this.cardCreationService.setAdress(this.formGroup.value);
        const associatedAccountId = this.cardCreationService.accountId;
        if (associatedAccountId) {
            this.redirectAndSendAccountId('e-wallet/card/name', associatedAccountId);
        } else {
            this.redirectTo('e-wallet/card/name');
        }
    }

    public isPostalCodeField(key: string): boolean {
        return key === 'postalCode';
    }

    private markAllControlsAsTouched(): void {
        this.formGroup.markAllAsTouched();
    }

    private buildForm(): Promise<void> {
        return new Promise((resolve) => {
            this.formGroup = this.formBuilder.group({
                deliveryAddress1: ['', [Validators.required, Validators.maxLength(100)]],
                deliveryAddress2: ['', [Validators.maxLength(100)]],
                postalCode: ['', [Validators.required]],
                city: ['', [Validators.required, Validators.maxLength(50)]],
                district: ['', [Validators.required, Validators.maxLength(50)]]
            });
            resolve();
        });
    }

    private redirectAndSendAccountId(path: string, id: string): void {
        this.routerExtensions.navigate([path], {
            queryParams: { accountId: id },
            transition: {
                name: 'fade'
            }
        });
    }
}
