import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild
} from "@angular/core";
import { Observable } from "rxjs";
import { Page } from "tns-core-modules/ui/page/page";
import { ValidationCodeInputComponent } from "~/app/shared/components";

@Component({
    selector: "omro-generic-pin",
    templateUrl: "./generic-pin.component.html"
})
export class GenericPinComponent{
    @ViewChild("input", { static: false })
    public pin: ValidationCodeInputComponent;

    @Input() public title: string;
    @Input() public description: string;
    @Input() public resetNotification: Observable<boolean>;

    @Output() public codeEntered: EventEmitter<string> = new EventEmitter<string>();

    constructor(private page: Page) {
        this.page.on("navigatedTo", () => this.pin.focus());
    }

    public emit(pin: string): void {
        this.codeEntered.emit(pin);
    }
}
