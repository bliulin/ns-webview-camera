import { Component, Input, ViewContainerRef } from '@angular/core';
import { CompanySelectionComponent } from '../company-selection-modal/company-selection.component';
import { Observable, combineLatest } from 'rxjs';
import { CompanySelection, CompanyMappingRoleDictionary } from '../../models';
import { map } from 'rxjs/operators';
import { BottomSheetOptions } from 'nativescript-material-bottomsheet/angular';
import { UserCustomerMappingOutputModel } from '~/app/core/models/user-profile';
import { UserProfileStateService } from '~/app/core/services/profile/user-profile-state.service';
import { RouterExtensions } from 'nativescript-angular';
import { ActivatedRoute } from "@angular/router";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";

@Component({
    selector: 'omro-profile-card',
    templateUrl: './profile-card.component.html',
    styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
    @Input() public vm: any;
    public mappingRole: typeof CompanyMappingRoleDictionary = CompanyMappingRoleDictionary;
    constructor(
        private omroModalService: OmroModalService,
        private containerRef: ViewContainerRef,
        private userProfileService: UserProfileStateService,
        private routerExtensions: RouterExtensions
    ) {}

    public hasAnotherSelectableCompany(companies: UserCustomerMappingOutputModel[]): boolean {
        const totalNumberOfEligibleCompanies = (
            companies.filter(company => this.userProfileService.isMappedAndHasNuidValid(company)) || []
        ).length;

        return true ? totalNumberOfEligibleCompanies > 1 : false;
    }

    public onCompanySelectionTap(): void {
        this.showCompanySelection();
    }

    private showCompanySelection(): void {
        const options: BottomSheetOptions = {
            viewContainerRef: this.containerRef,
            context: this.getCompaniesMappedToCompanySelectionModel(),
            transparent: true
        };

        this.omroModalService.showBottomSheet(CompanySelectionComponent, options);
    }

    private getCompaniesMappedToCompanySelectionModel(): Observable<CompanySelection[]> {
        return combineLatest([this.userProfileService.companies$, this.userProfileService.currentCompany$]).pipe(
            map(([companies, currentCustomer]) =>
                companies
                    .filter(company => this.userProfileService.isMappedAndHasNuidValid(company))
                    .map(
                        company =>
                            ({
                                customerId: company.customer.customerId,
                                customerName: company.customer.customerName,
                                isSelected: true
                                    ? company.customer.customerId === currentCustomer.customer.customerId
                                    : false
                            } as CompanySelection)
                    )
            )
        );
    }

    public onAccounValidateButtonTapped(): void {
        this.redirectTo('profile/validate-account');
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate([path], {
            transition: {
                name: "fade"
            }
        });
    }
}
