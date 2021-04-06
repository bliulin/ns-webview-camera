import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular';
import { PinStateService } from '~/app/shared/services/pin-state.service';
import { Observable } from 'rxjs';
import { BaseComponent } from '~/app/shared/base.component';
import { ActivatedRoute } from '@angular/router';
import { CreateCardService } from '../create-card.service';
import { take } from 'rxjs/operators';

@Component({
    selector: 'omro-set-card-pin',
    templateUrl: './set-card-pin.component.html',
    styleUrls: ['./set-card-pin.component.scss']
})
export class SetCardPinComponent extends BaseComponent implements OnInit {
    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private pinStateService: PinStateService,
        private route: ActivatedRoute,
        private cardCreationService: CreateCardService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.route.queryParams.pipe(take(1)).subscribe((params) => {
            const accountId = params.accountId || null;
            this.cardCreationService.setAccountId(accountId);
        });
    }

    public get resetInput(): Observable<void> {
        return this.pinStateService.resetInputSubject.asObservable();
    }

    public onBackButtonTap(): void {
        if (this.routerExtensions.canGoBack()) {
            super.goBack();
        } else {
            super.navigateToDashboard('e-wallet');
        }
    }

    public storePinAndRedirectToConfirmationStep(pin: string): void {
        this.pinStateService.pinIntroducedInThePreviousStep = pin;
        this.redirectTo(`/e-wallet/card/pin/confirm`);
    }
}
