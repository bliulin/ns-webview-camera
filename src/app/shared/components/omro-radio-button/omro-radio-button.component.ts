import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { registerElement } from 'nativescript-angular';
import { ContentView } from 'tns-core-modules/ui/page/page';
registerElement('omro-radio-button', () => OmroRadioButtonComponent);
@Component({
  selector: 'omro-radio-button',
  templateUrl: './omro-radio-button.component.html',
  styleUrls: ['./omro-radio-button.component.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: OmroRadioButtonComponent,
        multi: true
    }
]
})
export class OmroRadioButtonComponent extends ContentView implements ControlValueAccessor {
  @Input() public text: string;
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
