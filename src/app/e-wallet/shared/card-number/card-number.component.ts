import { Component, Input } from '@angular/core';

@Component({
    selector: 'omro-card-number',
    templateUrl: './card-number.component.html',
    styleUrls: ['./card-number.component.scss']
})
export class CardNumberComponent {
    @Input() public name: string;
    @Input() public last4Digits: string;
}
