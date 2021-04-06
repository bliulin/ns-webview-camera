import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular";
import { DynamicFormFieldOuputModel } from "~/app/credit-request/models/dynamicFormFieldOuputModel";
import { CalendarModal } from "~/app/shared/components/date-field/calendar-modal";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";

@Component({
    selector: 'omro-calendar-modal-android',
    templateUrl: './calendar-modal-android.component.html',
    styleUrls: ['./calendar-modal-android.component.scss']
})
export class CalendarModalAndroidComponent extends CalendarModal {
    constructor(protected params: ModalDialogParams, omroModalService: OmroModalService) {
        super(params);
        omroModalService.registerModalCallback(params.closeCallback);
    }
}
