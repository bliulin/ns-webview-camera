import { BottomSheetParams } from "nativescript-material-bottomsheet/angular";
import { DynamicFormFieldOuputModel } from "~/app/credit-request/models/dynamicFormFieldOuputModel";

export class CalendarModal {
    public minDate: Date;
    public maxDate: Date;

    public field: DynamicFormFieldOuputModel;
    public dateSelector: Date = new Date();

    constructor(protected params: BottomSheetParams) {
        if (params.context) {
            //TODO: min, max values
            this.field = params.context.field;
            const selectedDate = params.context.selectedDate as Date;
            if (selectedDate) {
                this.dateSelector = selectedDate;
            }
        }
    }

    public onCloseSelectDate(isCancel: boolean): void {
        console.log('isCancel: ' + isCancel)
        const result = isCancel ? null : this.dateSelector;
        this.params.closeCallback(result);
    }
}
