import { Component, OnInit } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";

@Component({
    selector: "omro-upload-finish",
    templateUrl: "upload-finish.component.html",
    styleUrls: ['upload-finish.component.scss']
})
export class UploadFinishComponent implements OnInit {

    public constructor(private params: ModalDialogParams, omroModalService: OmroModalService) {
        omroModalService.registerModalCallback(params.closeCallback);
    }

    public ngOnInit(): void {
    }

    public close(): void {
        this.params.closeCallback(true);
    }
}
