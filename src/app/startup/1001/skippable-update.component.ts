import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
    selector: "omro-skippable-update-page",
    templateUrl: "./skippable-update.component.html",
    styleUrls: ["./skippable-update.component.scss"]
})
export class SkippableUpdateComponent {
    constructor(private routerExt: RouterExtensions, private page: Page) {
        this.page.actionBarHidden = true;        
    }

    public onUpdateTapped(): void {}

    public onSkipVersionTapped(): void {
        this.redirectTo("/");
    }

    private redirectTo(path: string): void {
        this.routerExt.navigate([path], {
            clearHistory: true,
            transition: {
                name: "fade"
            }
        });
    }
}