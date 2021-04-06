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
import { DynamicFormFieldModel } from './dynamicFormFieldModel';

/**
 * Dynamic form post model
 */
export interface DynamicFormModel { 
    /**
     * Id of the form to be submitted
     */
    dynamicFormId?: string;
    /**
     * values of the form fields
     */
    fields?: Array<DynamicFormFieldModel>;
}