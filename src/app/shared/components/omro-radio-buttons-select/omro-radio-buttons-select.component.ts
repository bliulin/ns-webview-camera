import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
    selector: 'omro-radio-buttons-select',
    templateUrl: './omro-radio-buttons-select.component.html',
    styleUrls: ['./omro-radio-buttons-select.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: OmroRadioButtonsSelectComponent,
            multi: true
        }
    ]
})
export class OmroRadioButtonsSelectComponent implements OnInit, ControlValueAccessor {
    @Input() public possibleValues: Map<string, string>;
    @Input() public initialValue: string;
    @Input() public isReadonly: boolean;
    @Input() public hasCustomContent: boolean = false;
    @Input() public customData: Map<string, string>;

    public _value: string | null;

    public formGroup: FormGroup;
    private previousValue: string;
    constructor() {
        this.formGroup = new FormGroup({});
    }

    public ngOnInit(): void {
        this.buildForm();
        this.formGroup.valueChanges.subscribe(() => {
            if (this.previousValue) {
                // const previousCurrentValue = this.formGroup.get(this.previousValue).value;
                this.formGroup.get(this.previousValue).setValue(false, { emitEvent: false });
            } else {
                this.previousValue = this.getCurrentValue();
            }
            const currentValue = this.getCurrentValue();
            this.previousValue = currentValue;

            this.changeValue(currentValue);
        });
    }
    public get value(): string | null {
        return this._value;
    }

    public set value(value: string | null) {
        this._value = value;
    }

    public get getOptions(): string[] {
        return Object.keys(this.possibleValues);
    }

    private onChange: (value: string) => void;
    private onTouched: () => void;

    public changeValue(currentValue: string | null): void {
        if (this.isReadonly) {
            return;
        }
        this.value = currentValue;
        this.onChange(this.value);
    }

    public writeValue(value: string | null): void {
        this._value = value;
    }

    public registerOnChange(onChange: (value: string) => void): void {
        this.onChange = onChange;
    }

    public registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    private buildForm(): void {
        Object.keys(this.possibleValues).forEach(key => {
            const isInitialValue = key === this.initialValue;
            const control: FormControl = new FormControl(isInitialValue ? true : false);
            if (isInitialValue) {
                this.previousValue = key;
            }
            this.formGroup.addControl(key, control);
        });
    }

    private getCurrentValue(): string {
        const formGroupValues = this.formGroup.value;
        return Object.keys(formGroupValues).find(key => formGroupValues[key] !== false) || null;
    }
}
