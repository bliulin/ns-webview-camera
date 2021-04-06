import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TopProgressModel } from "~/app/shared/components/top-progress/top-progress-model";
import { KycService } from "~/app/kyc/services/kyc.service";
import { take, takeUntil } from "rxjs/internal/operators";
import { Subject } from "rxjs";

@Component({
    selector: 'omro-kyc-progress',
    templateUrl: './kyc-progress.component.html',
    styleUrls: ['./kyc-progress.component.scss']
})
export class KycProgressComponent implements OnInit, OnDestroy {
    private unsubscribe$: Subject<any> = new Subject();

    public topProgressModel: TopProgressModel = new TopProgressModel({
        maxValue: 3,
        progressValue: 1
    });

    @Output()
    public goBack: EventEmitter<any> = new EventEmitter();
    @Output()
    public close: EventEmitter<any> = new EventEmitter();

    constructor(private kycService: KycService) {
        this.topProgressModel.showBackButton = true;
    }

    public ngOnInit(): void {
        this.kycService.totalSteps
            .pipe(take(1))
            .subscribe(value => {
                this.topProgressModel.maxValue = value;
                this.topProgressModel.progressValue = this.topProgressModel.progressValue;
            });

        this.kycService.currentStepIndex
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(index => {
                this.topProgressModel.progressValue = index + 1;
            });
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onGoBackTapped() {
        this.goBack.emit();
    }

    onClosePressed() {
        this.close.emit();
    }
}
