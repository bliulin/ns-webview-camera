import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'omro-funds-arrive-instantly-label',
    templateUrl: './funds-arrive-instantly-label.component.html',
    styleUrls: ['./funds-arrive-instantly-label.component.scss']
})
export class FundsArriveInstantlyLabelComponent {
    @Input()
    public isFilboCustomer: boolean;
}
