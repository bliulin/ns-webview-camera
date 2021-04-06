import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContentView } from 'tns-core-modules/ui/page/page';
import { registerElement } from 'nativescript-angular';

registerElement('omro-action-button', () => OmroActionButtonComponent);
export enum OmroActionButtonStyle {
    Green = 'Green',
    Navy = 'Navy'
}

@Component({
    selector: 'omro-action-button',
    templateUrl: './omro-action-button.component.html',
    styleUrls: ['./omro-action-button.component.scss']
})
export class OmroActionButtonComponent extends ContentView {
    @Input() public text: string;
    @Input() public isEnabled: boolean = true;
    @Input() public buttonStyle: OmroActionButtonStyle = OmroActionButtonStyle.Green;
    @Input() public showIcon: boolean = true;

    @Output() public onButtonPress: EventEmitter<void> = new EventEmitter<void>();
}
