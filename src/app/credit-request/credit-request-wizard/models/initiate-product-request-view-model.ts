import { EligibleProductOutputModel } from "~/app/credit-request/models/eligibleProductOutputModel";

export class InitiateProductRequestViewModel {
    constructor(eligibleProduct: EligibleProductOutputModel) {
        this.productType = eligibleProduct.productType;
        this.title = eligibleProduct.firstStageTitle;
        this.destinationPlaceholder = eligibleProduct.destinationPlaceholder;
        this.minAmount = eligibleProduct.minAmount;
        this.maxAmount = eligibleProduct.maxAmount;
        this.currency = eligibleProduct.currency;
        this.currencyDisplayName = eligibleProduct.currencyDisplayName;
        this.requestedAmount = Math.round(eligibleProduct.maxAmount / 2);
        this.periods = eligibleProduct.periods;
    }

    productType: string;
    title: string;
    destinationPlaceholder: string;
    minAmount: number;
    maxAmount: number;
    currency: string;
    currencyDisplayName: string;
    requestedAmount: number;
    periods: number[];
}
