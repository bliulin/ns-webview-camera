import { UserCustomerMappingOutputModel } from './userCustomerMappingOutputModel';

/**
 * User profile info
 */
export interface UserProfileOutputModel { 
    /**
     * Primary key of the user send as sub claim by the Authentication Server
     */
    userId?: string;
    /**
     * The username
     */
    email?: string;
    /**
     * The name that the user wants to see in the user interface. Editable in the profile
     */
    displayName?: string;
    /**
     * First name of the user as entered in the registration stage. After KYC this is the legal name and is read-only
     */
    firstName?: string;
    /**
     * Last name of the user as entered in the registration stage. After KYC this is the legal name and is read-only
     */
    lastName?: string;
    /**
     * Was a KYC performed successfully? This is true even if the last KYC has expired
     */
    isKYCDataAvailable?: boolean;
    /**
     * Should the user update the KYC?
     */
    isKYCUpdateRequired?: boolean;
    /**
     * Date (UTC) of the last successul login
     */
    lastLogin?: Date;
    /**
     * Initials to be displayed in the avatar circle
     */
    initials?: string;
    /**
     * The customers associated with the user and the mapping info between the user and the customers
     */
    customerMappings?: Array<UserCustomerMappingOutputModel>;
    details?: string;
    actionButtonText?: string;
    phoneNumber?: string;
}