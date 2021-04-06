import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { CustomValidators } from '~/app/shared/validators/validators.component';
import { DynamicFormOutputModel } from '~/app/credit-request/models/dynamicFormOutputModel';
import { DynamicFormFieldRestrictions } from '~/app/credit-request/models/dynamicFormFieldRestrictions';
import { formatDate } from '~/app/shared/utils/date-time-format-utils';
import { DynamicFormFieldOuputModel } from '../../models/dynamicFormFieldOuputModel';
import { DynamicFormFieldType } from "~/app/credit-request/models/dynamicFormFieldType";

@Injectable({
    providedIn: 'root'
})
export class DynamicFormBuilder {
    public constructor(private formBuilder: FormBuilder) {}

    public buildForm(dynamicForm: DynamicFormOutputModel): FormGroup {
        const controlsConfig = {};
        for (const field of dynamicForm.formFields) {
            const validators = [];
            if (field.required) {
                validators.push(Validators.required);
            }

            validators.push(this.getValidatorsByRestrictions(field.restrictions));

            if (field.regexValidationString) {
                validators.push(this.getValidatorsByRegexPattern(field.regexValidationString));
            }
            if (field.fieldType !== DynamicFormFieldType.Calendar) {
                if (field.minimum) {
                    validators.push(Validators.min(field.minimum));
                }
                if (field.maximum) {
                    validators.push(Validators.max(field.maximum));
                }
            }

            if (field.fieldType === DynamicFormFieldType.Calendar) {
                this.createDateTimeMinMaxValidators(field, validators);
            }

            if (field.fieldType === DynamicFormFieldType.Textbox) {
                if (!!field.maxLength) {
                    const maxLengthValidator = this.createMaxLengthValidator(field);
                    validators.push(maxLengthValidator);
                }
            }

            const validatorsComposed: ValidatorFn = Validators.compose(validators);
            controlsConfig[field.fieldId] = [field.submittedValue || field.defaultValue || '', validatorsComposed];
        }

        const formGroup = this.formBuilder.group(controlsConfig);
        return formGroup;
    }

    private createDateTimeMinMaxValidators(field: DynamicFormFieldOuputModel, validators: any[]): void {
        if (!!field.minimum) {
            const minDate = new Date();
            field.minimum < 0
                ? minDate.setDate(minDate.getDate() + field.minimum)
                : minDate.setDate(minDate.getDate() - field.minimum);
            validators.push(CustomValidators.dateMinimum(formatDate(minDate, 'YYYY-MM-DD')));
        }
        if (!!field.maximum) {
            const maxDate = new Date();
            maxDate.setDate(maxDate.getDate() + field.maximum);
            validators.push(CustomValidators.dateMaximum(formatDate(maxDate, 'YYYY-MM-DD')));
        }
    }

    private getValidatorsByRestrictions(restrictions: DynamicFormFieldRestrictions): any {
        if (restrictions === DynamicFormFieldRestrictions.Email) {
            return Validators.email;
        }
        if (restrictions === DynamicFormFieldRestrictions.IBAN) {
            return CustomValidators.validateIBAN();
        }

        const pattern = this.getPatternByRestrictionType(restrictions);
        if (pattern) {
            return this.getValidatorsByRegexPattern(pattern);
        }
    }

    private getPatternByRestrictionType(restrictionType: DynamicFormFieldRestrictions): string {
        switch (restrictionType) {
            case 'Alphanumeric':
                return '[a-zA-Z0-9]+';
            case 'Digits':
                return '[0-9]+';
        }
        return null;
    }

    private getValidatorsByRegexPattern(pattern: string): ValidatorFn {
        return Validators.pattern(pattern);
    }

    private createMaxLengthValidator(field: DynamicFormFieldOuputModel): ValidatorFn {
        return Validators.maxLength(field.maxLength);
    }
}
