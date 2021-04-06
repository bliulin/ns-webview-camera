import { Component, OnInit } from '@angular/core';
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { ModalDialogParams } from "nativescript-angular/directives/dialogs";
import { SimpleModalModel } from "~/app/shared/components/simple-modal/simple-modal-model";
import { ModalCloseResponse } from "~/app/shared/components/simple-modal/modal-close-response";

@Component({
    selector: 'ns-simple-modal',
    templateUrl: './simple-modal.component.html',
    styleUrls: ['./simple-modal.component.scss']
})
export class SimpleModalComponent implements OnInit {
    public model: SimpleModalModel = {};

    constructor(private params: ModalDialogParams, omroModalService: OmroModalService) {
        omroModalService.registerModalCallback(params.closeCallback);
        this.model = params.context.model;
    }

    ngOnInit() {

    }

    close() {
        this.params.closeCallback(<ModalCloseResponse>{
            callToActionExecuted: false
        });
    }

    onContinueTapped() {
        this.params.closeCallback(<ModalCloseResponse>{
            callToActionExecuted: true
        });
    }
}
