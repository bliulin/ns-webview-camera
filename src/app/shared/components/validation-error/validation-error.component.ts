import { Component, Input } from "@angular/core";

@Component({
    selector: "ValidationError",
    moduleId: module.id,
    template: `
        <StackLayout [height]="height" marginRight="20" verticalAlignment="center">
            <Label
                class="error m-10"
                textWrap="true"
                [text]="errorMessage"
                [ngClass]="{ hidden: !show }"
            ></Label>
        </StackLayout>
    `
})
export class ValidationErrorComponent {
    @Input("errorMessage") public errorMessage: string;
    @Input() public show: boolean = true;
    @Input("height") public height: number = 30;
}
