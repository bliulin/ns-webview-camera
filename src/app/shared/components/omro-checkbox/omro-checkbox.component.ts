import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { registerElement } from 'nativescript-angular';
import { ContentView } from 'tns-core-modules/ui/page/page';
registerElement('omro-checkbox', () => OmroCheckboxComponent);

@Component({
    selector: 'omro-checkbox',
    moduleId: module.id,
    templateUrl: './omro-checkbox.component.html',
    styleUrls: ['./omro-checkbox.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: OmroCheckboxComponent,
            multi: true
        }
    ]
})
export class OmroCheckboxComponent extends ContentView implements ControlValueAccessor {
    @Input() public text: string;
    @Input() public invalid: boolean;
    @Input() public readonly: boolean;

    public _value: boolean;

    private onChange: (value: boolean) => void;
    private onTouched: () => void;

    public get value(): boolean {
        return this._value;
    }

    public set value(value: boolean) {
        this._value = value;
    }

    public toggle(): void {
        if (this.readonly) {
            return;
        }
        this.value = !this._value;
        this.onChange(this.value);
    }

    public writeValue(value: boolean): void {
        this._value = value;
    }

    public registerOnChange(onChange: (value: boolean) => void): void {
        this.onChange = onChange;
    }

    public registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }
}
