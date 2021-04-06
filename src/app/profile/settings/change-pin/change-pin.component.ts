import { Component, ViewChild } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Observable } from "rxjs";
import { ValidationCodeInputComponent } from "~/app/shared/components";
import { Location } from "@angular/common";
import { Page } from "tns-core-modules/ui/page/page";
import { PinStateService } from "~/app/shared/services/pin-state.service";

@Component({
  selector: 'omro-change-pin',
  templateUrl: './change-pin.component.html'
})
export class ChangePinComponent {
    @ViewChild('input', { static: false }) public pinInput: ValidationCodeInputComponent;

    constructor(
        private page: Page,
        private routerExtensions: RouterExtensions,
        private pinStateService: PinStateService,
        private location: Location
    ) {
        this.page.actionBarHidden = true;
    }

    public get resetInput(): Observable<void> {
        return this.pinStateService.resetInputSubject.asObservable();
    }

    public goBack(): void {
        this.location.back();
    }

    public sendPinToConfirmationStep(pin: string): void {
        this.pinStateService.pinIntroducedInThePreviousStep = pin;
        this.redirectTo('/profile/settings/change-pin/confirm');
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate([path], {
            transition: {
                name: "slideLeft"
            }
        });
    }
}
