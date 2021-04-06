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
import { FileOutputModel } from './fileOutputModel';

/**
 * Logical grouping of files that have business meaning. Eg. Contract files
 */
export interface FileSetOutputModel { 
    /**
     * The set id to be sent with the uploaded file
     */
    fileSetId?: string;
    /**
     * The name of the file set
     */
    setName?: string;
    /**
     * Details to be displayed for the user
     */
    details?: string;
    /**
     * Lista de extensii de fisiere permise pentru acest upload set  valorile sunt in lowercase cu punct. Ex ['.jpg','.jpeg','.pdf']
     */
    allowedUploadFileExtentions?: Array<string>;
    /**
     * The maxmimum allowed size for each file in the set (in bytes)
     */
    allowedUploadMaxFileSize?: number;
    /**
     * The maximum number of documents allowed in the set
     */
    allowedUploadMaxFileNumber?: number;
    /**
     * If True, the set does not allow uploads or deletions of files in the set
     */
    readOnly?: boolean;
    /**
     * A friendly name that specifies who generated the set (OMRO, or the Display Name of the user)
     */
    filesUploadedBy?: string;
    /**
     * A list of files uploaded in this set
     */
    uploadedFiles?: Array<FileOutputModel>;
}