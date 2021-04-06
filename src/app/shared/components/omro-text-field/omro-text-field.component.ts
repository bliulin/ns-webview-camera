import { Component, Input, EventEmitter, Output, OnInit, ViewChild, ElementRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { ReturnKeyType, KeyboardType, AutocapitalizationType } from "@nativescript/core/ui/editable-text-base/editable-text-base";
import { registerElement } from "nativescript-angular";
import { ContentView } from "tns-core-modules/ui/page/page";
registerElement('omro-text-field', () => OmroTextFieldComponent);
@Component({
    selector: "omro-text-field",
    moduleId: module.id,
    templateUrl: "./omro-text-field.component.html",
    styleUrls: ["./omro-text-field.component.scss"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: OmroTextFieldComponent,
            multi: true
        }
    ]
})
export class OmroTextFieldComponent extends ContentView implements ControlValueAccessor, OnInit {
    @Input() public label: string;
    @Input() public placeholder: string;
    @Input() public keyboardType: KeyboardType;
    @Input() public returnKeyType: ReturnKeyType;
    @Input() public maxLength: number = 1000;
    @Input() public showCounter: boolean = false;
    @Input() public showError: boolean = false;
    @Input() public errorMessage: string;
    @Input() public isReadOnly: boolean = false;
    @Input() public autocorrect: boolean = false;
    @Input() public autocapitalizationType: AutocapitalizationType = "none";

    @Output() public returnPress: EventEmitter<any> = new EventEmitter();

    @ViewChild('valueRef', { static: false }) private self: ElementRef;

    private _value: string;

    private onChange: (value: string) => void;
    private onTouched: () => void;

    public get value(): any {
        return this._value;
    }
    public set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }
    public onBlur(): void {
        this.onTouched();
    }

    public ngOnInit(): void {
    }

    public writeValue(value: any): void {
        this._value = value;
    }

    public registerOnChange(onChange: (value: string) => void): void {
        this.onChange = onChange;
    }

    public registerOnTouched(onTouched: () => void): void {
        this.onTouched = onTouched;
    }

    public onReturnPress(): void {
        this.returnPress.emit();
    }

    public focusElement() {
        this.self.nativeElement.focus();
    }
}
