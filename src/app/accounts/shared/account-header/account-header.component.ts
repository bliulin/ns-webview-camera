import { Component, Input } from '@angular/core';
import { registerElement } from 'nativescript-angular';
import { ContentView } from 'tns-core-modules/ui/page/page';

registerElement('omro-account-header', () => AccountHeaderComponent);
@Component({
    selector: 'omro-account-header',
    templateUrl: './account-header.component.html',
    styleUrls: ['./account-header.component.scss']
})
export class AccountHeaderComponent extends ContentView {
    @Input() public accountName: string;
}
