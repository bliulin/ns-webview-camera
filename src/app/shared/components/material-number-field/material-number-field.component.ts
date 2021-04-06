import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'MNumberField',
    moduleId: module.id,
    template: `
        <StackLayout class="ntextfield-border" [class.visible]="inputHasFocus">
            <StackLayout class="ntextfield" [class.focus]="inputHasFocus">
                <TextField
                    #self
                    class="input"
                    keyboardType="number"
                    maxlength="1"
                    (focus)="onFocus()"
                    (blur)="onBlur()"
                    [formControl]="input"
                ></TextField>
            </StackLayout>
        </StackLayout>
    `,
    styleUrls: ['./material-number-field.component.scss']
})
export class MaterialNumberFieldComponent {
    @Input('form-control') public input: FormControl;
    @ViewChild('self', { static: true }) private self: ElementRef;
    
    public inputHasFocus: boolean = false;

    public onFocus(): void {
        this.inputHasFocus = true;
    }

    public onBlur(): void {
        this.inputHasFocus = false;
    }

    public focus(): void {
        this.self.nativeElement.focus();
    }
}
