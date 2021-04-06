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
import { CardState } from './cardState';
import { Limit } from './limit';
import { UIInfo } from './uIInfo';
import { CardType } from '.';

export interface Card { 
    readonly cardId?: string;
    readonly name?: string;
    readonly cardType?: CardType;
    readonly cardState?: CardState;
    readonly readOnly?: boolean;
    readonly stateName?: string;
    readonly processor?: string;
    readonly balance?: number;
    readonly currencyCode?: string;
    readonly currecyDisplayName?: string;
    readonly ui?: UIInfo;
    readonly limits?: Array<Limit>;
}