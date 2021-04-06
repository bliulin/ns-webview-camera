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
import { ApprovalSuccessPicture } from './approvalSuccessPicture';

/**
 * Information necessary to draw the Apply Now button
 */
export interface EligibleProductOutputModel { 
    /**
     * The product type that this request applies to  Default = \"standard\"
     */
    productType?: string;
    /**
     * Section title
     */
    title?: string;
    /**
     * Section details
     */
    details?: string;
    /**
     * Text to be displayed on the dashboard card when there are loan requests in progress or existing loans
     */
    secondaryDetails?: string;
    /**
     * The title of the first stage (before submitting the request)
     */
    firstStageTitle?: string;
    /**
     * Minimum amount that can be requested
     */
    minAmount?: number;
    /**
     * Maximum amount that can be requested
     */
    maxAmount?: number;
    /**
     * The currency code of the amount (to be use when POST-ing)
     */
    currency?: string;
    /**
     * The UI name of the currency
     */
    currencyDisplayName?: string;
    /**
     * List of eligible periods for the product
     */
    periods?: Array<number>;
    /**
     * What is the expected aproval success rate for this loan application
     */
    approvalSuccessRate?: number;
    /**
     * Depending on the success rate, the application will select a stored image to  be displayed next to the approval rate. This field helps in selecting that image
     */
    approvalSuccessPicture?: ApprovalSuccessPicture;
    /**
     * Details to pe displayed in a popup invoked by a clicking the percent image associated with the Success Rate
     */
    approvalSuccessDetail?: string;
    /**
     * Title for the details to pe displayed in a popup invoked by a clicking the percent image associated with the Success Rate
     */
    approvalSuccessTitle?: string;
    /**
     * False if the apply button should be disabled
     */
    isApplyAvailable?: boolean;
    /**
     * The customer cannot reapply for this product for the following number of days
     */
    cooldownRemainingDays?: number;
    /**
     * Text to be displayed as a hint in the destination
     */
    destinationPlaceholder?: string;
    interestRate?: number;
    monthlyCommissionRate?: number;
    upfrontCommissionRate?: number;
}