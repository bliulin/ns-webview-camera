import { Component } from '@angular/core';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';

@Component({
    selector: 'omro-company-add-button',
    templateUrl: './company-add-button.component.html',
    styleUrls: ['./company-add-button.component.scss']
})
export class CompanyAddButtonComponent extends BaseComponent {
    constructor(routerExtensions: RouterExtensions) {
        super(routerExtensions);
    }

    public onAddCompanyTap(): void {
        this.redirectTo('profile/company/add');
    }
}
