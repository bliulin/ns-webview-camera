import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';

@Component({
    selector: 'ns-password-reset-confirmation',
    templateUrl: './password-reset-confirmation.component.html',
    styleUrls: ['./password-reset-confirmation.component.scss']
})
export class PasswordResetConfirmationComponent implements OnInit {
    title: string;
    details: string;

    constructor(page: Page, private route: ActivatedRoute, private routerExtensions: RouterExtensions) {
        page.actionBarHidden = true;
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(map => {
            this.title = map.get('title');
            this.details = map.get('details');
        });
    }

    public onTap() {
        this.routerExtensions.backToPreviousPage();
    }
}
