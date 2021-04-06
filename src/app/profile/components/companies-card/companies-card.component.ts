import { Component, Input, ViewContainerRef } from '@angular/core';
import { NUIDValidationStatus, UserCustomerMappingOutputModel } from '~/app/core/models/user-profile';
import { UserAction } from '../../models';
import localize from 'nativescript-localize';
import { DialogResult } from '~/app/shared/app.enums';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { UserProfileStateService } from '~/app/core/services/profile/user-profile-state.service';
import { CompanyApiService } from '../../services/company-api.service';
import { NotificationBannerService } from '~/app/shared/services';
import { RouterExtensions } from 'nativescript-angular';
import { BaseComponent } from '~/app/shared/base.component';
import {
    BottomDialogButtonType,
    Orientation
} from "~/app/shared/models/bottom-dialog.config";

@Component({
    selector: 'omro-companies-card',
    templateUrl: './companies-card.component.html',
    styleUrls: ['./companies-card.component.scss']
})
export class CompaniesCardComponent extends BaseComponent {
    @Input() public vm: any;
    constructor(
        routerExtensions: RouterExtensions,
        private containerRef: ViewContainerRef,
        private userProfileService: UserProfileStateService,
        private companyService: CompanyApiService,
        private notificationBannerService: NotificationBannerService,
        private dialogService: OmroModalService
    ) {
        super(routerExtensions);
    }

    public canShowContextualMenu(company: UserCustomerMappingOutputModel): boolean {
        return (
            company.mappingEnabled ||
            (company.customer.nuidValidationStatus === NUIDValidationStatus.Valid &&
                company.customer.isDeletePermitted === true)
        );
    }

    public onCompanyContextualMenuTap(company: UserCustomerMappingOutputModel, currentCustomerId: string): void {
        this.showCompanyContextualMenu(company, currentCustomerId);
    }

    public isMappedAndHasKycDone(company: UserCustomerMappingOutputModel): boolean {
        return company.customer.isKYCDone && company.mappingEnabled;
    }

    public onCompanyActionButtonTap(customerId: string): void {
        this.redirectTo(`profile/company/${customerId}/details`);
    }

    private showCompanyContextualMenu(company: UserCustomerMappingOutputModel, currentCustomerId: string): void {
        this.dialogService
            .showBottomDialog({
                viewContainerRef: this.containerRef,
                title: localize("Common.Actions"),
                orientation: Orientation.Vertical,
                actions: [
                    {
                        buttonType: BottomDialogButtonType.Secondary,
                        text: localize("Profile.Companies.Actions.SetActive"),
                        isHidden: !this.canBeSelectedAsCurrent(company, currentCustomerId),
                        result: UserAction.SetActive
                    },
                    {
                        buttonType: BottomDialogButtonType.Secondary,
                        text: localize("Profile.Companies.Actions.Details"),
                        isHidden: !this.detailsAreAvaible(company),
                        result: UserAction.Details
                    },
                    {
                        buttonType: BottomDialogButtonType.Error,
                        text: localize("Profile.Companies.Actions.Remove"),
                        isHidden: !this.canBeRemoved(company, currentCustomerId),
                        result: UserAction.Delete
                    }
                ]
            })
            .subscribe(action => {
                switch (action) {
                    case UserAction.SetActive:
                        this.userProfileService.setCurrentCustomer(company.customer.customerId);
                        break;
                    case UserAction.Details:
                        this.redirectTo(`profile/company/${company.customer.customerId}/details`);
                        break;
                    case UserAction.Delete:
                        setTimeout(() => this.showConfirmation(company.customer.customerId), 300);
                        break;
                    default:
                        break;
                }
            });
    }

    private handleSuccess(): void {
        this.userProfileService.reload();
    }

    private handleError(error: any): void {
        const errorDetails = error.error || null;

        switch (error.status) {
            case 400:
                this.notificationBannerService.showError(errorDetails, 4000);
                break;
            default:
                this.notificationBannerService.showGenericError({
                    title: localize('Common.GenericErrorMessage.title'),
                    detail: localize('Common.GenericErrorMessage.detail')
                });
                break;
        }
    }

    private showConfirmation(customerId: string): void {
        this.dialogService
            .showBottomDialog<DialogResult>({
                viewContainerRef: this.containerRef,
                title: localize('Profile.Company.Remove'),
                message: localize('Profile.Company.RemoveConfirmationHeaderText'),
                actions: [
                    {
                        buttonType: BottomDialogButtonType.Error,
                        text: localize('Common.Yes') + ' ' + localize('Common.Delete'),
                        result: DialogResult.Yes
                    },
                    {
                        buttonType: BottomDialogButtonType.Transparent,
                        text: localize('Common.No'),
                        result: DialogResult.No
                    }
                ]
            })
            .subscribe(response => {
                if (response === DialogResult.Yes) {
                    this.companyService.removeCustomer(customerId).subscribe(
                        () => this.handleSuccess(),
                        error => this.handleError(error)
                    );
                }
            });
    }
    private canBeSelectedAsCurrent(
        selectedCompany: UserCustomerMappingOutputModel,
        currentCustomerId: string
    ): boolean {
        return (
            this.isNotAlreadySelected(selectedCompany.customer.customerId, currentCustomerId) &&
            this.userProfileService.isMappedAndHasNuidValid(selectedCompany)
        );
    }

    private isNotAlreadySelected(selectedCompanyId: string, currentCustomerId: string): boolean {
        return selectedCompanyId !== currentCustomerId;
    }

    private detailsAreAvaible(selectedCompany: UserCustomerMappingOutputModel): boolean {
        return selectedCompany.mappingEnabled;
    }

    private canBeRemoved(selectedCompany: UserCustomerMappingOutputModel, currentCustomerId: string): boolean {
        return (
            selectedCompany.customer.isDeletePermitted &&
            this.isNotAlreadySelected(selectedCompany.customer.customerId, currentCustomerId)
        );
    }
}
