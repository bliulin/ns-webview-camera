import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContentView } from 'tns-core-modules/ui/page/page';
import { registerElement } from 'nativescript-angular';

registerElement('omro-horizontal-button', () => OmroHorizontalButtonComponent);

@Component({
    selector: 'omro-horizontal-button',
    templateUrl: './omro-horizontal-button.component.html',
    styleUrls: ['./omro-horizontal-button.component.scss']
})
export class OmroHorizontalButtonComponent extends ContentView {
    @Input() public buttonHasBorder: boolean = false;
    @Input() public hasGreenIconBackground: boolean = false;
    @Output() public onButtonTap: EventEmitter<void> = new EventEmitter<void>();
}
