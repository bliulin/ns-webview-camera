import { ContentView } from "tns-core-modules/ui/content-view/content-view";
import { Input } from "@angular/core";
import { DynamicFormFieldOuputModel } from "~/app/credit-request/models/dynamicFormFieldOuputModel";

export class CheckboxesComponentContentView extends ContentView {
    @Input()
    public field: DynamicFormFieldOuputModel;

    public getOptions(): {key, value}[] {
        const keys = Object.keys(this.field.possibleValues);
        return keys.map((key) => {
            return {
                key: key,
                value: this.field.possibleValues[key]
            };
        });
    }

    getHeight() {
        return this.getOptions().length * 38;
    }
}
