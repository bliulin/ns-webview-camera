import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TopProgressModel } from "~/app/shared/components/top-progress/top-progress-model";
import { ContentView } from "tns-core-modules/ui/content-view/content-view";
import { registerElement } from "nativescript-angular";

registerElement("omro-top-progress", () => TopProgressComponent);

@Component({
    selector: "omro-top-progress",
    templateUrl: "./top-progress.component.html",
    styleUrls: ["./top-progress.component.scss"]
})
export class TopProgressComponent extends ContentView {
    @Input()
    public model: TopProgressModel;
    @Output()
    public closePressed: EventEmitter<any> = new EventEmitter();
    @Output()
    public backTapped: EventEmitter<any> = new EventEmitter();

    public close() {
        this.closePressed.emit("");
    }

    public goBack(): void {
        this.backTapped.emit();
    }
}
