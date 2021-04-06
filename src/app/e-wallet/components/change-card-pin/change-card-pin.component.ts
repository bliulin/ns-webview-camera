import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { Page } from 'tns-core-modules/ui/page/page';
import { PinStateService } from '~/app/shared/services/pin-state.service';
import { BaseComponent } from '~/app/shared/base.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'omro-change-card-pin',
    templateUrl: './change-card-pin.component.html',
    styleUrls: ['./change-card-pin.component.scss']
})
export class ChangeCardPinComponent extends BaseComponent implements OnInit {
    constructor(routerExtensions: RouterExtensions, private page: Page, private pinStateService: PinStateService) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }
    public get resetInput(): Observable<void> {
        return this.pinStateService.resetInputSubject.asObservable();
    }

    ngOnInit() {}

    public onBackButtonTap(): void {
        super.goBack();
    }

    public storePinAndRedirectToConfirmationStep(pin: string): void {
      this.pinStateService.pinIntroducedInThePreviousStep = pin;
      this.redirectTo(`/e-wallet/configuration/change-pin/confirm`);
  }
}
