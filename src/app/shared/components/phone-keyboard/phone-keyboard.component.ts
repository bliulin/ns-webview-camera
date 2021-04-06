import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from "@angular/core";

@Component({
    selector: "omro-phone-keyboard",
    templateUrl: "./phone-keyboard.component.html",
    styleUrls: ["./phone-keyboard.component.scss"]
})
export class PhoneKeyboardComponent implements OnInit {

    @Output()
    public keyPressed:EventEmitter<string> = new EventEmitter<string>();
    @Input()
    public rightKeyTemplate:TemplateRef<any>;
    @Input()
    public leftKeyTemplate:TemplateRef<any>;

    constructor() {}

    ngOnInit() {}

    onTap(key: string) {
        this.keyPressed.emit(key);
    }
}
