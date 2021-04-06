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
import { Account } from './account';
import { EligibleCurrency } from './eligibleCurrency';

export interface AccountsOutputModel { 
    accounts?: Array<Account>;
    eligibleCurrencies?: EligibleCurrency;
}