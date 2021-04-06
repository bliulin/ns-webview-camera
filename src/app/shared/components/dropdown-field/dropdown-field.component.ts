import { EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { ModalDialogService } from 'nativescript-angular';
import { SingleSelectComponent } from '~/app/shared/components/dropdown-field/single-select/single-select.component';
import { DataItem } from '~/app/shared/models/data-item';

import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { registerElement } from 'nativescript-angular/element-registry';
import { ContentView } from 'tns-core-modules/ui/content-view/content-view';
import { DynamicFormFieldOuputModel } from '~/app/credit-request/models/dynamicFormFieldOuputModel';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';

registerElement('omro-dropdown-field', () => DropdownFieldComponent);

@Component({
    selector: 'omro-dropdown-field',
    moduleId: module.id,
    templateUrl: './dropdown-field.component.html',
    styleUrls: ['./dropdown-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropdownFieldComponent),
            multi: true
        }
    ]
})
export class DropdownFieldComponent extends ContentView implements ControlValueAccessor {
    private _value: DataItem;

    @Input()
    public field: DynamicFormFieldOuputModel;

    @Input()
    public modalDialogService: OmroModalService;

    @Input()
    public viewContainer: ViewContainerRef;

    @Input()
    public isReadOnly: boolean;

    @Input()
    public placeholder: string;

    @Output()
    public itemChanged: EventEmitter<DataItem> = new EventEmitter();

    @Output()
    public tapped: EventEmitter<any> = new EventEmitter();

    public selectedItem: DataItem = {
        value: '',
        text: ''
    };

    public get labelText(): string {
        const preKey = this.field.submittedValue || this.field.defaultValue;
        const preVal = this.field.possibleValues[preKey];
        let text = this.value.text || preVal;
        if (!text) {
            text = this.placeholder;
        }
        return text;
    }

    public get isPlaceHolder(): boolean {
        return !(this.value.text || this.field.defaultValue);
    }

    public async onTap(): Promise<void> {
        this.tapped.emit();
        const result = await this.modalDialogService.showModal(SingleSelectComponent, {
            animated: true,
            viewContainerRef: this.viewContainer,
            fullscreen: true,
            context: {
                field: this.field
            }
        });
        if (result && result.selectedItem) {
            this.value = result.selectedItem;
            this.itemChanged.emit(this.value);
        }
    }

    public get value(): DataItem {
        return this._value;
    }

    public set value(v: DataItem) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v.value);
        }
    }

    public writeValue(dataItem: DataItem): void {
        this._value = dataItem;
        this.onChange(dataItem.value);
    }

    public onChange = (value: any) => {
        this.selectedItem = value;
    }

    public onTouched = () => {};

    public registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }
    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}
