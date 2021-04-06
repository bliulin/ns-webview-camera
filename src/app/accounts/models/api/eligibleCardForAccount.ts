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
import { CardType } from './cardType';

export interface EligibleCardForAccount { 
    readonly productId?: string;
    readonly name?: string;
    readonly cardType?: CardType;
    readonly successMessage?: string;
    readonly processor?: string;
    readonly processorCardType?: string;
}