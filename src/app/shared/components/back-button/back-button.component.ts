import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "BackButton",
    moduleId: module.id,
    templateUrl: './back-button.component.html'
})
export class BackButtonComponent {

    @Input()
    public text: string;
    @Input()
    public grayBackground: boolean = false;

    @Output("backWasPressed") private tap: EventEmitter<void> = new EventEmitter();

    public onBackTap(): void {
        this.tap.emit();
    }
}
