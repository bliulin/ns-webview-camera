import { Component } from '@angular/core';
import { registerElement } from 'nativescript-angular';
import { ContentView } from 'tns-core-modules/ui/content-view/content-view';

registerElement('omro-card', () => CardPanelComponent);

@Component({
    selector: 'omro-card',
    templateUrl: './card-panel.component.html',
    styleUrls: ['./card-panel.component.scss']
})
export class CardPanelComponent extends ContentView {}
