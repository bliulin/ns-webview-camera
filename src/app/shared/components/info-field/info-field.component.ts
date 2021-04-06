import { Component, Input } from "@angular/core";
import { ContentView, Color } from "tns-core-modules/ui/page/page";
import { registerElement } from "nativescript-angular";
import { AppColors } from "../../constants";
registerElement("omro-info-field", () => InfoFieldComponent);

@Component({
    selector: "omro-info-field",
    template: `<StackLayout orientation="vertical">
                <Label class="caption" text="{{caption}}" style="margin-bottom: 4;text-transform: uppercase;" [style.color]="captionColor"></Label>
                <ng-content></ng-content>
             </StackLayout>`
})
export class InfoFieldComponent extends ContentView {
    @Input() public caption: string;
    @Input() public captionColor: Color = new Color(AppColors.Gray);
}
