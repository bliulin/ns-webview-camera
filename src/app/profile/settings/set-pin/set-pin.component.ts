import { Component } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Observable } from "rxjs";
import { Page } from "tns-core-modules/ui/page/page";
import { PinStateService } from "~/app/shared/services/pin-state.service";

@Component({
    selector: "ns-set-pin",
    templateUrl: "./set-pin.component.html"
})
export class SetPinComponent {
    constructor(
        private page: Page,
        private routerExtensions: RouterExtensions,
        private pinStateService: PinStateService
    ) {
        this.page.actionBarHidden = true;
    }

    public get resetInput(): Observable<void> {
        return this.pinStateService.resetInputSubject.asObservable();
    }

    public sendPinToConfirmationStep(pin: string): void {
        this.pinStateService.pinIntroducedInThePreviousStep = pin;
        this.redirectTo('/profile/settings/set-pin/confirm');
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate([path], {
            transition: {
                name: "slideLeft"
            }
        });
    }
}
