import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductRequestFlowViewModel } from '~/app/credit-request/services/product-request-flow-view-model';
import { CreditRequestService } from '~/app/credit-request/services/credit-request.service';
import { Page } from 'tns-core-modules/ui/page/page';
import { FlowStageGenericOutputModel } from '../models/flowStageGenericOutputModel';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { CreditRequestControllerService } from '~/app/credit-request/services/credit-request-controller.service';
import { ActivatedRoute } from '@angular/router';
import { StageType } from "~/app/credit-request/services/stage-type.model";
import { takeUntil } from "rxjs/internal/operators";

@Component({
    templateUrl: './stage-container.component.html',
    styleUrls: ['./stage-container.component.scss']
})
export class StageContainerComponent extends BaseComponent implements OnInit, OnDestroy {
    public productRequest: ProductRequestFlowViewModel;
    public StageType = StageType;
    private _productStageType: StageType;
    private _routeStageType: StageType;

    constructor(
        public routerExtensions: RouterExtensions,
        private creditRequestService: CreditRequestService,
        private page: Page,
        private creditRequestControllerService: CreditRequestControllerService,
        private route: ActivatedRoute
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
        route.paramMap.subscribe(m => {
            const stageType = <StageType>m.get('stageType');
            this._routeStageType = stageType !== StageType.Current ? <StageType>stageType : null;

        });
    }

    get stageType(): StageType {
        return this._routeStageType || this._productStageType;
    }

    get hasProductSelection(): boolean {
        return this.stageType === 'ProductSelection' && !!this.productRequest.currentStage.stageDetails.productSelection;
    }

    public ngOnInit(): void {
        this.creditRequestService
            .getCurrentProductRequest()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(p => {
                this.productRequest = p;
                if (p && p.currentStage && p.currentStage.stageDetails) {
                    this._productStageType = p.currentStage.stageDetails.stageType;
                }
            });
    }

    public get dynamicFormId(): string {
        return this.productRequest.currentStage.stageDetails.dynamicForm.formId;
    }

    public get dynamicFormTitle(): string {
        return this.productRequest.currentStage.title;
    }

    public get genericStage(): FlowStageGenericOutputModel {
        return this.productRequest.currentStage.stageDetails.generic;
    }
}
