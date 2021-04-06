import { Injectable } from "@angular/core";
import { CompanyDetailsViewModel } from "~/app/profile/company/models/company-details-view-model";

@Injectable()
export class CompanyStateService {
    private _companyState: CompanyDetailsViewModel;

    public get companyDetails(): CompanyDetailsViewModel {
        return this._companyState;
    }

    public set companyDetails(value: CompanyDetailsViewModel) {
        this._companyState = value;
        this._companyState.kycDynamicFormCompleted = value.customer.kycDynamicForm.readOnly ? true : false;
        this._companyState.kycUploadDocumentsLoaded = value.customer.kycFileRepository.fileSets.every(fileSet => fileSet.readOnly);
    }
}
