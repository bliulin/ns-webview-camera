import { localize } from "nativescript-localize";
import { FormGroup } from "@angular/forms";
import { DynamicFormOutputModel } from "~/app/credit-request/models/dynamicFormOutputModel";

export class ErrorMessages {
    public static getError(fieldName: string, formGroup: FormGroup, dynamicForm: DynamicFormOutputModel): string {
        const field = formGroup.get(fieldName);
        if (field.valid) {
            return '';
        }
        const [firstError] = Object.keys(field.errors);

        let message = localize(`DynamicForm.ValidationMessages.${firstError}`);
        const dynamicField = dynamicForm.formFields.find(f => f.fieldId === fieldName);
        if (dynamicField) {
            if (firstError === 'pattern' || firstError === 'email' || firstError === 'validIBAN' || firstError === 'dateMinimum' || firstError === 'dateMaximum') {
                message = dynamicField.errorMessageValidation || message;
            }
            if (firstError === 'required') {
                message = dynamicField.errorMessageRequired || message;
            }
        }
        return message;
    }
}
