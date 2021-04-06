import { Component, OnInit } from "@angular/core";
import { BottomSheetParams } from "nativescript-material-bottomsheet/angular";
import { CompanySelection } from "../../models";
import { Observable } from "rxjs";
import { UserProfileStateService } from "~/app/core/services/profile/user-profile-state.service";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";

@Component({
    selector: "omro-company-selection",
    templateUrl: "./company-selection.component.html",
    styleUrls: ["./company-selection.component.scss"]
})
export class CompanySelectionComponent implements OnInit {
    public companies$: Observable<CompanySelection[]>;

    constructor(
        private params: BottomSheetParams,
        private userProfileService: UserProfileStateService,
        private omroModalService: OmroModalService) {
            this.omroModalService.registerModalCallback(params.closeCallback);
        }

    public ngOnInit(): void {
        this.companies$ = this.params.context;
    }

    public onTap(customerId: string): void {
        this.emitSelectedCompany(customerId);
    }

    private emitSelectedCompany(customerId: string): void {
        this.userProfileService.setCurrentCustomer(customerId);
        setTimeout(() => this.params.closeCallback(), 500);
    }
}
