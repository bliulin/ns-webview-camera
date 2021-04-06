import { Component, Input } from "@angular/core";

@Component({
    selector: "SuccessMessage",
    moduleId: module.id,
    template: `
        <StackLayout minHeight="30" marginRight="20">
            <Label
                class="success"
                textWrap="true"
                [text]="successMessage"
            ></Label>
        </StackLayout>
    `
})
export class SuccessMessageComponent {
    @Input("successMessage") public successMessage: string;
}
