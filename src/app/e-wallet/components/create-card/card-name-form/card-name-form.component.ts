import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Page } from 'tns-core-modules/ui/page/page';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { CreateCardService } from '../create-card.service';
import localize from 'nativescript-localize';
import { NotificationBannerService } from '~/app/shared/services';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'omro-card-name-form',
    templateUrl: './card-name-form.component.html',
    styleUrls: ['./card-name-form.component.scss']
})
export class CardNameFormComponent extends BaseComponent implements OnInit {
    public cardNameFormControl: FormControl;

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private route: ActivatedRoute,
        private cardCreationService: CreateCardService,
        private notificationBannerService: NotificationBannerService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.cardNameFormControl = new FormControl('', [Validators.required, Validators.maxLength(20)]);

        this.route.queryParams.pipe(take(1)).subscribe((params) => {
            const accountId = params.accountId || null;
            this.cardCreationService.setAccountId(accountId);
        });
        this.cardCreationService.eligibleCardVM$.pipe(take(1)).subscribe();
    }

    public getErrorMessage(): string {
        const fieldErrors = this.cardNameFormControl.errors;
        if (fieldErrors.required) {
            return localize('EWallet.Homepage.NoCardsAdded.NewCard.DeliveryAdress.ValidationErrors.Required');
        } else if (fieldErrors.maxlength) {
            return localize('EWallet.Homepage.NoCardsAdded.NewCard.DeliveryAdress.ValidationErrors.MaxLength');
        }
    }

    public goBack(): void {
        this.routerExtensions.backToPreviousPage();
    }

    public onNextTap(): void {
        this.cardCreationService.setCardName(this.cardNameFormControl.value);
        this.cardCreationService.createCard().subscribe(
            (success) => this.redirectTo('e-wallet/card/finish', true, 'fade'),
            (error) => this.notificationBannerService.showGenericError()
        );
    }

    public onActionTap(): void {
        if (!this.cardNameFormControl.valid) {
            this.cardNameFormControl.markAsTouched();
            return;
        } else {
            this.onNextTap();
        }
    }
}
