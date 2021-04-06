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

/**
 * Information representing the selected offer parameters
 */
export interface ProductOfferModel { 
    /**
     * Id of the proposed offer
     */
    productOfferId?: string;
    /**
     * The amount accepted by the customer. Must be less or equal than the offered amount. NULL if not accepted yet
     */
    acceptedAmount?: number;
    /**
     * The period accepted by the customer. Must be from the options provided by the offer. NULL if not accepted yet
     */
    aceptedDuration?: number;
}