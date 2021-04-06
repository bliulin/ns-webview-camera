import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";
import { TermsAndConditionsModel } from "../../models/terms-and-conditions.model";
import { exit } from 'nativescript-exit';
import { OmroModalService } from "~/app/shared/services/omro-modal.service";

@Component({
    selector: "tc-modal",
    templateUrl: "terms-and-conditions.component.html",
    styles: ['.icon_close { horizontal-align: left; }']
})
export class TermsAndConditionsModalComponent implements OnInit {    
    public termsAndConditions: string = "Terms and conditions";
    public confirmationMode: boolean;
    public model: TermsAndConditionsModel;

    public constructor(private params: ModalDialogParams, omroModalService: OmroModalService) {
        omroModalService.registerModalCallback(params.closeCallback);
        this.confirmationMode = params.context.confirmationMode;
        this.model = params.context.model;
    }    

    public ngOnInit(): void {
    }

    public close(): void {
        this.params.closeCallback(true);
    }    

    public onContinueTapped(): void {
        this.close();
    }

    public onCloseAppTapped(): void {
        exit();
    }    
}
