import { Component, OnInit } from '@angular/core';
import { BottomSheetParams } from 'nativescript-material-bottomsheet/angular';
import { DialogResult } from '~/app/shared/app.enums';
import { ProductRequestCancelationReasonOutputModel } from '~/app/credit-request/models/productRequestCancelationReasonOutputModel';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';

export interface ProductCancelationReasonsModalResult {
    dialogResult: DialogResult;
    selectedReasons?: string[];
}

type Reason = ProductRequestCancelationReasonOutputModel & { checked: boolean };

@Component({
    templateUrl: './product-cancelation-reasons-modal.component.html',
    styleUrls: ['./product-cancelation-reasons-modal.component.scss']
})
export class ProductCancelationReasonsModalComponent {
    private reasons: Reason[];

    constructor(private params: BottomSheetParams, omroModalService: OmroModalService) {
        omroModalService.registerModalCallback(params.closeCallback);
        this.reasons = (params.context as ProductRequestCancelationReasonOutputModel[]).map((r) => {
            return { ...r, checked: false } as Reason;
        });
    }

    public back() {
        this.params.closeCallback({ dialogResult: DialogResult.Cancel });
    }

    public quit() {
        const selectedReasons = this.reasons.filter((r) => r.checked).map((r) => r.cancelationCode);

        const args = <ProductCancelationReasonsModalResult>{
            dialogResult: DialogResult.Yes,
            selectedReasons: selectedReasons
        };
        this.params.closeCallback(args);
    }
}
