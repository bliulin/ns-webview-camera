import { Component, ElementRef, ViewChild, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { registerElement } from 'nativescript-angular/element-registry';
import { ContentView } from 'tns-core-modules/ui/content-view/content-view';
import { ReturnKeyType, KeyboardType, AutocapitalizationType } from '@nativescript/core/ui/editable-text-base/editable-text-base';
import { Label } from 'tns-core-modules/ui/label/label';
import { Page, isAndroid } from 'tns-core-modules/ui/page/page';

registerElement('MTextField', () => MaterialTextFieldComponent);

@Component({
    selector: 'MTextField',
    moduleId: module.id,
    templateUrl: './material-text-field.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: MaterialTextFieldComponent,
            multi: true
        }
    ]
})
export class MaterialTextFieldComponent extends ContentView implements ControlValueAccessor, AfterViewInit {
    @Input() public placeholder: string;
    @Input() public secure: boolean;
    @Input() public hasSelectionBorder: boolean = true;
    @Input() public keyboardType: KeyboardType;
    @Input() public returnKeyType: ReturnKeyType;
    @Input() public maxLength: number = 1000;
    @Input() public autocorrect: boolean = false;
    @Input() public autocapitalizationType: AutocapitalizationType = "none";
    @Output() public returnPress: EventEmitter<any> = new EventEmitter();
    @ViewChild('label', { static: true }) public label: ElementRef<Label>;
    @ViewChild('textField', { static: true }) public textField: ElementRef;

    public hasFocus: boolean = false;
    private _value: any = '';

    public get value(): any {
        return this._value;
    }
    public set value(v: any) {
        if (v !== this._value) {
            this._value = v;
            this.onChange(v);
        }
    }

    public ngAfterViewInit(): void {
        if (this._value) {
            this.floatUp();
        }
    }

    public onFocus(): void {
        this.hasFocus = true;
        this.floatUp();
    }

    public onBlur(): void {
        const textField = this.textField.nativeElement;
        this.hasFocus = false;
        if (!textField.text) {
            this.floatDown();
        }
        this.onTouched();
    }

    public writeValue(value: any): void {
        this._value = value;
        // warning: comment below if only want to emit on user intervention
        this.onChange(value);
    }

    public onChange = (_: any) => {};

    public onTouched = () => {};

    public registerOnChange(fn: (_: any) => void): void {
        this.onChange = fn;
    }
    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public onReturnPress(): void {
        this.returnPress.emit();
    }

    private floatDown(): any {
        const label = this.label.nativeElement;
        label
            .animate({
                translate: { x: 0, y: 0 },
                scale: { x: 1, y: 1 }
            })
            .then(
                () => {},
                () => {}
            );
    }

    private floatUp(): void {
        const label = this.label.nativeElement;
        label.originX = 0;
        label.originY = 0;
        const translateX = isAndroid ? 7 : 5;
        label
            .animate({
                translate: { x: translateX, y: -14 },
                scale: { x: 0.70, y: 0.70 }
            })
            .then(
                () => {},
                () => {}
            );
    }
}
