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
import { UserKYCUrlOutputModel } from './userKYCUrlOutputModel';

/**
 * Object representing a KYC Session
 */
export interface UserKYCOutputModel { 
    /**
     * Id of the KYC Session
     */
    sessionId?: string;
    /**
     * List of URLs with metadata that must be shown to the user to complete the KYC process
     */
    iFrameURLs?: Array<UserKYCUrlOutputModel>;
}