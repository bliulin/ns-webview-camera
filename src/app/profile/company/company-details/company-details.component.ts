import { Component, HostListener, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular';
import { ActivatedRoute } from '@angular/router';
import { UserProfileStateService } from '~/app/core/services/profile/user-profile-state.service';
import { UserCustomerMappingOutputModel } from '~/app/core/models/user-profile';
import { Observable } from 'rxjs';
import { CompanyApiService } from '../../services/company-api.service';
import { NotificationBannerService } from '~/app/shared/services';
import { localize } from 'nativescript-localize/angular';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { DialogResult } from '~/app/shared/app.enums';
import { CompanyDetailsViewModel } from '~/app/profile/company/models/company-details-view-model';
import { CompanyStateService } from '~/app/profile/company/services/company-state.service';
import { MessagingService } from '~/app/core/services/messaging.service';
import { ProductRequestEvents, UploadDocuments } from '~/app/shared/constants';
import { UploadFileInputModel } from '~/app/upload-documents/models/upload-file-input-model';
import { take } from 'rxjs/internal/operators';
import { UploadFinishedModel } from '~/app/upload-documents/models/upload-finished-model';
import { Feature } from '~/app/core/models/feature';
import { traceDebug } from '~/app/core/logging/logging-utils';
import { BottomDialogButtonType } from "~/app/shared/models/bottom-dialog.config";

@Component({
    selector: 'omro-company-details',
    templateUrl: './company-details.component.html',
    styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {
    public company$: Observable<UserCustomerMappingOutputModel>;
    public currentCompany$: Observable<UserCustomerMappingOutputModel>;
    public dynamicFormImageSrc: string = '~/app/images/test.svg';
    public companyId: string;
    public companyViewModel: CompanyDetailsViewModel = {};

    constructor(
        private page: Page,
        private routerExtensions: RouterExtensions,
        private dialogService: OmroModalService,
        private route: ActivatedRoute,
        private containerRef: ViewContainerRef,
        private userProfileService: UserProfileStateService,
        private companyService: CompanyApiService,
        private notificationBannerService: NotificationBannerService,
        private messagingService: MessagingService,
        private companyStateService: CompanyStateService
    ) {
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        const id = this.route.snapshot.params.id;
        this.companyId = id;
        this.company$ = this.userProfileService.selectedCompany$;
        this.currentCompany$ = this.userProfileService.currentCompany$;
        this.userProfileService.companySelectedSubject.next(id);

        this.userProfileService.selectedCompany$.subscribe(value => {
            Object.assign(this.companyViewModel, value);
            this.companyStateService.companyDetails = this.companyViewModel;
        });
    }

    @HostListener('loaded')
    public pageInit(): void {
        const companyState = this.companyStateService.companyDetails;
        if (!companyState) {
            return;
        }
        traceDebug('KYC dynamic form completed: ' + companyState.kycDynamicFormCompleted);
        traceDebug('KYC upload docs completed: ' + companyState.kycUploadDocumentsLoaded);
        this.companyViewModel.kycDynamicFormCompleted = companyState.kycDynamicFormCompleted;
        this.companyViewModel.kycUploadDocumentsLoaded = companyState.kycUploadDocumentsLoaded;
    }

    public goBack(): void {
        this.page.actionBarHidden = true;
        this.routerExtensions.back();
    }

    public onRemoveCompanyTap(customerId: string): void {
        this.showConfirmation().subscribe(response => {
            if (response === DialogResult.Yes) {
                this.companyService.removeCustomer(customerId).subscribe(
                    () => this.handleSuccess(),
                    error => this.handleError(error)
                );
            }
        });
    }

    public openDynamicForm(id: string): void {
        this.redirectTo(`profile/company/${id}/dynamic-form`);
    }

    public canBeRemoved(selectedCompany: UserCustomerMappingOutputModel, currentCustomerId: string): boolean {
        return selectedCompany.customer.isDeletePermitted && selectedCompany.customer.customerId !== currentCustomerId;
    }

    public openDocumentsUpload(fileRepositoryId: string): void {
        this.messagingService.setState(UploadDocuments.Input, <UploadFileInputModel>{
            fileRepositoryId: fileRepositoryId,
            source: Feature.CompanySetup,
            pageTitle: 'Where do we get the title from?'
        });
        this.messagingService
            .getEvent<UploadFinishedModel>(ProductRequestEvents.UploadDocumentsFinished)
            .pipe(take(1))
            .subscribe(
                model =>
                    (this.companyStateService.companyDetails.kycUploadDocumentsLoaded = model.areFilesUploadedOnAllSets)
            );
        this.redirectTo('upload-documents');
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate([path], {
            transition: {
                name: 'slideLeft'
            }
        });
    }

    private showConfirmation(): Observable<DialogResult> {
        return this.dialogService.showBottomDialog<DialogResult>({
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
        });
    }

    private handleSuccess(): void {
        this.userProfileService.reload();
        this.goBack();
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
}
