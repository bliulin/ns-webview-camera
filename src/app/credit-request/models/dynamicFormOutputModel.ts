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
import { DynamicFormFieldOuputModel } from './dynamicFormFieldOuputModel';

/**
 * Details necessary for creating the form
 */
export interface DynamicFormOutputModel { 
    title?: string;
    /**
     * Details regarding the form
     */
    details?: string;
    /**
     * The id of the form. This should be sent when posting the form data
     */
    formId?: string;
    /**
     * The fields of the dynamic form
     */
    formFields?: Array<DynamicFormFieldOuputModel>;
    /**
     * If true then the form is displayed as a list of lables (label + value) with not input controlls
     */
    readOnly?: boolean;
}