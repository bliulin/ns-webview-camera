import { ProductRequestFlowStageDetailsType } from "~/app/credit-request/models/productRequestFlowStageDetailsType";

export type StageType = ProductRequestFlowStageDetailsType | 'InitiateProductRequest' | 'Current' | 'Uvp';
export const StageType = {
    ...ProductRequestFlowStageDetailsType,
    InitiateProductRequest: 'InitiateProductRequest' as StageType,
    Current: 'Current' as StageType,
    Uvp: 'Uvp' as StageType
};
