/**
 * OMRO DigitalApp API
 * API used on OMRO Digital Resources
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { FileRepositoryOutputModel } from './fileRepositoryOutputModel';
import { ProductRequestFlowStageOutputModel } from './productRequestFlowStageOutputModel';
import { ProductRequestOutputModel } from './productRequestOutputModel';

/**
 * The current view of the Product Request flow
 */
export interface ProductRequestFlowOutputModel { 
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
}