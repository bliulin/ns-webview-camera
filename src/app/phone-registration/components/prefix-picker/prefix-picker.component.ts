import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular";
import { PhonePrefix } from "~/app/phone-registration/models/phone-prefix";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";

@Component({
    selector: "ns-prefix-picker",
    templateUrl: "./prefix-picker.component.html",
    styleUrls: ["./prefix-picker.component.scss"]
})
export class PrefixPickerComponent {
    public items: PhonePrefix[];

    public constructor(private params: ModalDialogParams, omroModalService: OmroModalService) {
        omroModalService.registerModalCallback(params.closeCallback);
        this.items = params.context.items;
    }

    public onItemTap(event: any): void {
        this.params.closeCallback(this.items[event.index]);
    }
}
