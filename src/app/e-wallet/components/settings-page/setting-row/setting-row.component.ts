import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'omro-setting-row',
    templateUrl: './setting-row.component.html',
    styleUrls: ['./setting-row.component.scss']
})
export class SettingRowComponent {
    @Input() public title: string;
    @Input() public description: string;
    @Input() public checked: FormControl;
}
