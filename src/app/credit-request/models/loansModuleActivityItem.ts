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
 * Information about a recent loan activity
 */
export interface LoansModuleActivityItem { 
    /**
     * date of the activity
     */
    activityDate?: Date;
    /**
     * Text to be used when selecting an icon
     */
    iconHint?: string;
    /**
     * The title of the activity
     */
    title?: string;
    /**
     * The amount
     */
    amount?: number;
    /**
     * The currency (lei, euro)
     */
    currencyDisplayName?: string;
}