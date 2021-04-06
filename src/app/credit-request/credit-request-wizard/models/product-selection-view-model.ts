import { ProductRequestFlowStageOutputModel } from "~/app/credit-request/models/productRequestFlowStageOutputModel";
import { FlowStageProductSelectionOutputModel } from "~/app/credit-request/models/flowStageProductSelectionOutputModel";
import { equatedMonthlyInstallment } from "~/app/core/utils/financial";

export class ProductSelectionViewModel {
    private _acceptedAmount?: number = 0;
    private _acceptedDuration?: number = 0;

    constructor(param: {
        productRequestId: string;
        productOfferId: string;
        acceptedAmount: number;
        acceptedDuration: number;
        currencyDisplayName: string;
        stage: ProductRequestFlowStageOutputModel;
    }) {
        Object.assign(this, param);
        this.productSelection = this.stage.stageDetails.productSelection;
    }

    productRequestId: string;

    productOfferId?: string;

    get acceptedDuration(): number {
        return this._acceptedDuration;
    }

    set acceptedDuration(value: number) {
        this._acceptedDuration = value;
        this.computeInstalments();
    }

    get acceptedAmount(): number {
        return this._acceptedAmount;
    }

    set acceptedAmount(value: number) {
        this._acceptedAmount = value;
        this.computeInstalments();
    }

    monthlyPayment: number;

    totalPayment: number;

    currencyDisplayName: string;

    stage: ProductRequestFlowStageOutputModel;

    productSelection: FlowStageProductSelectionOutputModel;

    private computeInstalments() {
        const interestRate = this.stage.stageDetails.productSelection.offeredInterestRate / 100;
        this.monthlyPayment = equatedMonthlyInstallment(
            this._acceptedAmount,
            interestRate,
            this.acceptedDuration
        );
        this.totalPayment = this.monthlyPayment * this.acceptedDuration;
    }
}
