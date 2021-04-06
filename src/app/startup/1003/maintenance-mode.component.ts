import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page/page";
import { exit } from 'nativescript-exit';

@Component({
    selector: "omro-maintenance-mode-page",
    templateUrl: "./maintenance-mode.component.html",
    styleUrls: ["./maintenance-mode.component.scss"]
})
export class MaintenanceModeComponent {
    constructor(private routerExt: RouterExtensions, private page: Page) {
        this.page.actionBarHidden = true;        
    }

    public onCloseAppTapped(): void {
        exit();
    }
}