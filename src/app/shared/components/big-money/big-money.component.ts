import { Component, Input, OnInit } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { ContentView } from 'tns-core-modules/ui/page/page';

registerElement('omro-big-money', () => BigMoneyComponent);
@Component({
    selector: 'omro-big-money',
    templateUrl: './big-money.component.html',
    styleUrls: ['./big-money.component.scss']
})
export class BigMoneyComponent extends ContentView implements OnInit {
    @Input() public currency: string;
    @Input() public value: number;

    constructor() {
        super();
    }

    ngOnInit() {}
}
