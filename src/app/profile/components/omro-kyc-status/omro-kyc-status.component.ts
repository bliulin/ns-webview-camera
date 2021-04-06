import { Component, Input } from "@angular/core";

@Component({
    selector: 'omro-kyc-status',
    templateUrl: './omro-kyc-status.component.html',
    styleUrls: ['./omro-kyc-status.component.scss']
})
export class OmroKycStatusComponent {
    @Input() public isKYCDataAvailable: boolean;
    @Input() public isProfile: boolean = false;
}