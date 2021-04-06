import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreditRequestService } from "~/app/credit-request/services/credit-request.service";
import { TopProgressModel } from "~/app/shared/components/top-progress/top-progress-model";

@Component({
    selector: 'omro-credit-request-progress',
    templateUrl: './credit-request-progress.component.html',
    styleUrls: ['./credit-request-progress.component.scss']
})
export class CreditRequestProgressComponent implements OnInit {

    public topProgressModel: TopProgressModel = new TopProgressModel();

    @Input()
    public minimized: boolean = false;
    @Output()
    public closePressed: EventEmitter<any> = new EventEmitter()

    constructor(private service: CreditRequestService) {
    }

    public async ngOnInit(): Promise<void> {
        this.topProgressModel.minimized = this.minimized;

        this.service.getCurrentProductRequest().subscribe(flow => {
            this.topProgressModel.maxValue = flow.stages.length;
            const index = flow.stages.findIndex(stage => stage === flow.currentStage);
            this.topProgressModel.progressValue = index + 1;
            this.topProgressModel.showProgressValue = true;
        });
    }

    public onClosePressed() {
        this.closePressed.emit();
    }
}
