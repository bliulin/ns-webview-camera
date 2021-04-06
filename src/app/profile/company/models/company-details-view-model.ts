import {
    CustomerOutputModel,
    UserCustomerMappingOutputModel,
    UserCustomerMappingRole
} from "~/app/core/models/user-profile";
import { UserCustomerMappingStatus } from "~/app/core/models/user-profile/userCustomerMappingStatus";

export class CompanyDetailsViewModel implements UserCustomerMappingOutputModel {

    /**
     * The type of mapping between the user and the customer
     */
    public mappingRole?: UserCustomerMappingRole;
    /**
     * The status of the mapping from Omro perspective
     */
    public mappingStatus?: UserCustomerMappingStatus;
    /**
     * The customer detail
     */
    public customer?: CustomerOutputModel;
    /**
     * If false, the user cannot select the company. It is shown only for a short period of time before deletion.
     */
    public mappingEnabled?: boolean;

    public kycDynamicFormCompleted?: boolean;
    public kycUploadDocumentsLoaded?: boolean;
}
