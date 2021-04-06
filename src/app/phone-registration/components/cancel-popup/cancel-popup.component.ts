import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular";
import { DialogResult } from "~/app/shared/app.enums";
import { LocaleService } from "~/app/core/services/locale.service";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";


@Component({
    selector: "omro-cancel-popup",
    templateUrl: "./cancel-popup.component.html"
})
export class CancelPopupComponent implements OnInit {
    private locale: string;
    constructor(private params: ModalDialogParams,
                private localeService: LocaleService,
                private omroModalService: OmroModalService) {
        this.locale = localeService.currentLocale.substring(0, 2);
        omroModalService.registerModalCallback(params.closeCallback);
    }

    public ngOnInit(): void {}

    public onTap(result: "No" | "Yes"): void {
        this.params.closeCallback(<DialogResult>result);
    }

    public localizeImg(imgSrc: string) {
        return `${imgSrc}_${this.locale}`;
    }
}
