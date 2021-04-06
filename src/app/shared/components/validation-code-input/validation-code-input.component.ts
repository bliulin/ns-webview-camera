import { Component, Output, EventEmitter, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { MaterialNumberFieldComponent } from '..';

@Component({
    selector: 'CodeValidation',
    template: `
        <FlexboxLayout
            class="m-20"
            alignItems="flex-start"
            justifyContent="space-between"
            [formGroup]="formGroup"
            [class.shake]="_shake"
            [class.hasGreenBorder]="valid === true"
            [class.hasRedBorder]="valid === false"
        >
            <MNumberField #digit1 [form-control]="formGroup.get('firstDigit')"></MNumberField>
            <MNumberField #digit2 [form-control]="formGroup.get('secondDigit')"></MNumberField>
            <MNumberField #digit3 [form-control]="formGroup.get('thirdDigit')"></MNumberField>
            <MNumberField #digit4 [form-control]="formGroup.get('fourthDigit')"></MNumberField>
        </FlexboxLayout>
    `,
    styleUrls: ['validation-code-input.component.scss']
})
export class ValidationCodeInputComponent implements OnInit, OnDestroy {
    @ViewChild('digit1', { static: true }) private digit1: MaterialNumberFieldComponent;
    @ViewChild('digit2', { static: true }) private digit2: MaterialNumberFieldComponent;
    @ViewChild('digit3', { static: true }) private digit3: MaterialNumberFieldComponent;
    @ViewChild('digit4', { static: true }) private digit4: MaterialNumberFieldComponent;

    @Input('resetNotification') private resetNotification: Observable<boolean>;
    @Output('codeWasEntered') private notifier: EventEmitter<string> = new EventEmitter();

    public formGroup: FormGroup;

    private formSubscription: Subscription;
    private parentNotificationsSubscriptions: Subscription;
    public _shake: boolean = false;
    public valid: boolean;

    constructor(private formBuilder: FormBuilder) {
        this.formGroup = this.formBuilder.group({
            firstDigit: ['', Validators.required],
            secondDigit: ['', Validators.required],
            thirdDigit: ['', Validators.required],
            fourthDigit: ['', Validators.required]
        });
    }

    public set validInput(value: boolean) {
        this.valid = value;
    }

    public ngOnInit(): void {
        this.digit1.focus();

        if (this.resetNotification) {
            this.parentNotificationsSubscriptions = this.resetNotification.subscribe(() => this.resetForm());
        }

        this.formGroup.get('firstDigit').valueChanges.subscribe(input => {
            if (input) {
                this.digit2.focus();
            }
        });

        this.formGroup.get('secondDigit').valueChanges.subscribe(input => {
            if (input) {
                this.digit3.focus();
            } else {
                this.digit1.focus();
            }
        });
        this.formGroup.get('thirdDigit').valueChanges.subscribe(input => {
            if (input) {
                this.digit4.focus();
            } else {
                this.digit2.focus();
            }
        });
        this.formGroup.get('fourthDigit').valueChanges.subscribe(input => {
            if (!input) {
                this.digit3.focus();
            }
        });

        this.formSubscription = this.formGroup.valueChanges.subscribe(values => {
            if (this.formGroup.valid) {
                let code = '';
                Object.keys(values).forEach(key => {
                    code = code.concat(values[key]);
                });
                this.notifier.emit(code);
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.formSubscription) {
            this.formSubscription.unsubscribe();
        }

        if (this.parentNotificationsSubscriptions) {
            this.parentNotificationsSubscriptions.unsubscribe();
        }
    }

    public resetForm(): void {
        this.formGroup.reset();
        setTimeout(() => this.digit1.focus(), 100);
    }

    public shake(): void {
        this._shake = true;
        setTimeout(() => (this._shake = false), 700);
    }

    public focus(): void {
        this.digit1.focus();
    }
}
