import { ProductRequestFlowOutputModel } from '../models/productRequestFlowOutputModel';
import { ProductRequestOutputModel } from '../models/productRequestOutputModel';
import { FileRepositoryOutputModel } from '../models/fileRepositoryOutputModel';
import { ProductRequestFlowStageOutputModel } from '../models/productRequestFlowStageOutputModel';
import { ProductRequestFlowStageState } from '../models/productRequestFlowStageState';

export class ProductRequestFlowViewModel implements ProductRequestFlowOutputModel {
    constructor(data: ProductRequestFlowOutputModel) {
        Object.assign(this, data);
    }

    /**
     * Summary of the product request. The same structure as returned by the /productrequests endpoint
     */
    productRequestSummary?: ProductRequestOutputModel;
    /**
     * Repository used by the Generic steps when MainAction is FileRepository
     */
    genericStepsRepository?: FileRepositoryOutputModel;
    /**
     * Repository used to add all file sets belonging to this request
     */
    productRequestFlowRepository?: FileRepositoryOutputModel;
    /**
     * Product details. Can be used to show legal information. Localized
     */
    productDetails?: string;
    /**
     * List of stages that the application flow transitions through. Only one stage is InProgress
     */
    stages?: Array<ProductRequestFlowStageOutputModel>;

    /**
     * Returns the current stage
     */
    public get currentStage(): ProductRequestFlowStageOutputModel {
        return this.stages.find(stage => stage.state === ProductRequestFlowStageState.InProgress);
    }
}
