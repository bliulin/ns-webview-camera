import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page/page";
import { exit } from 'nativescript-exit';

@Component({
    selector: "omro-urgent-update-page",
    templateUrl: "./urgent-update.component.html",
    styleUrls: ["./urgent-update.component.scss"]
})
export class UrgentUpdateComponent {
    constructor(private routerExt: RouterExtensions, private page: Page) {
        this.page.actionBarHidden = true;        
    }

    public onUpdateTapped(): void {}    

    public onCloseAppTapped(): void {
        exit();
    }
}