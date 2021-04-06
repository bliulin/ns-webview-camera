import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ContentView } from 'tns-core-modules/ui/page/page';
import { registerElement } from 'nativescript-angular/element-registry';

registerElement('omro-close-button', () => CloseButtonComponent);

@Component({
    selector: 'omro-close-button',
    templateUrl: './close-button.component.html',
    styleUrls: ['./close-button.component.scss']
})
export class CloseButtonComponent extends ContentView {
    @Output() public tapClose: EventEmitter<any> = new EventEmitter();

    constructor() {
        super();
    }

    public onTap() {
        this.tapClose.emit();
    }
}
