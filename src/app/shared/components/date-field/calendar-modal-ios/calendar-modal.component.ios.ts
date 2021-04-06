import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DynamicFormFieldOuputModel } from "~/app/credit-request/models/dynamicFormFieldOuputModel";
import { BottomSheetParams } from "nativescript-material-bottomsheet/angular";
import { CalendarModal } from "~/app/shared/components/date-field/calendar-modal";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";

@Component({
    selector: 'omro-calendar-modal-ios',
    templateUrl: './calendar-modal.component.ios.html',
    styleUrls: ['./calendar-modal.component.ios.scss']
})
export class CalendarModalIosComponent extends CalendarModal {
    constructor(protected params: BottomSheetParams, omroModalService: OmroModalService) {
        super(params);
        omroModalService.registerModalCallback(params.closeCallback);
    }
}
