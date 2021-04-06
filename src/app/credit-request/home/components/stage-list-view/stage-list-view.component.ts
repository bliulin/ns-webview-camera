import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { Stage } from "./stage";

@Component({
    selector: "omro-stage-list-view",
    templateUrl: "./stage-list-view.component.html",
    styleUrls: ["./stage-list-view.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StageListViewComponent implements OnInit {
    @Input() public stages: Stage[] = [];

    constructor() {}

    public get rows(): string {
        const res = this.stages.map((s) => s.state == "InProgress" ? "36,auto" : "24,auto").join(",");
        return res.substring(0, res.length - 5); // remove last ',auto'
    }

    public ngOnInit(): void {}

    public getClass(item: Stage, row: number): any {
        return {
            'finished': item.state === "Finished",
            'not-started': item.state === "NotStarted",
            'in-progress': item.state === "InProgress",
            'first': row === 0,
            'last': this.isLastRow(row)
        };
    }

    isLastRow = (row: number) => row === this.stages.length - 1;
}
