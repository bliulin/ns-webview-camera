import { Component, EventEmitter, forwardRef, Input, Output, ViewContainerRef } from '@angular/core';
import { CalendarModalIosComponent } from "~/app/shared/components/date-field/calendar-modal-ios/calendar-modal.component.ios";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { registerElement } from "nativescript-angular/element-registry";
import { ContentView } from "tns-core-modules/ui/content-view/content-view";
import { DynamicFormFieldOuputModel } from "~/app/credit-request/models/dynamicFormFieldOuputModel";
import { BottomSheetOptions } from "nativescript-material-bottomsheet/angular";
import { isAndroid } from "tns-core-modules/platform";
import { CalendarModalAndroidComponent } from "~/app/shared/components/date-field/calendar-modal-android/calendar-modal-android.component";
import { formatDate } from "~/app/shared/utils/date-time-format-utils";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";

registerElement("omro-dropdown-field", () => DateFieldComponent);

@Component({
    selector: 'omro-date-field',
    templateUrl: './date-field.component.html',
    styleUrls: ['./date-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DateFieldComponent),
            multi: true
        }
    ]
})
export class DateFieldComponent extends ContentView implements ControlValueAccessor {
    private _value: Date = new Date();

    @Input()
    private modalDialogService: OmroModalService;

    public dateLabel: string;
    private readonly placeholder: string = '_ _/_ _/_ _ _ _';

    @Input()
    public field: DynamicFormFieldOuputModel;

    @Input()
    public viewContainer: ViewContainerRef;

    @Input()
    public isReadOnly: boolean;

    @Output()
    public dateChanged: EventEmitter<Date> = new EventEmitter();

    constructor() {
        super();
        this.dateLabel = this.placeholder;
    }

    public get value(): any {
        return this._value;
    }

    public set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }

    public get isPlaceHolder(): boolean {
        return this.dateLabel === this.placeholder;
    }

    public writeValue(value: any): void {
        this._value = value;
        // warning: comment below if only want to emit on user intervention
        this.onChange(value);
    }

    public onChange = (value: any) => {
    }

    public onTouched = () => {
    }

    public registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public async onTap(): Promise<void> {
        if (isAndroid) {
            this.showDateTimeModalAndroid();
        }
        else {
            this.showDateTimeModalIOS();
        }
    }

    private async showDateTimeModalAndroid(): Promise<void> {
        const result = await this.modalDialogService.showModal(CalendarModalAndroidComponent, {
            animated: true,
            viewContainerRef: this.viewContainer,
            fullscreen: false,
            context: {
                field: this.field,
                selectedDate: this.value
            }
        });
        if (result) {
            this.dateLabel = formatDate(result);
            this.writeValue(result);
            this.dateChanged.emit(result);
        }
    }

    private async showDateTimeModalIOS(): Promise<void> {
        const options: BottomSheetOptions = {
            viewContainerRef: this.viewContainer,
            context: {
                field: this.field,
                selectedDate: this.value
            },
            transparent: true
        };
        this.modalDialogService
            .showBottomSheet(CalendarModalIosComponent, options)
            .subscribe((result: Date) => {
                console.log('handle result: ' + result);
                this.handleResult(result);
            });
    }

    private handleResult(result: Date): void {
        if (result) {
            this.dateLabel = formatDate(result);
            this.writeValue(result);
            this.dateChanged.emit(result);
        }
    }
}
