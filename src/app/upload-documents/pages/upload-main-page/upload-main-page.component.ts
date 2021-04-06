import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { UploadFileSet } from "~/app/upload-documents/models/upload-file-set";
import { UploadStateService } from "~/app/upload-documents/services/upload-state.service";
import { RouterExtensions } from "nativescript-angular";
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { traceError } from '~/app/core/logging/logging-utils';
import { FileCleanupService } from "~/app/upload-documents/services/file-picker/file-cleanup.service";
import { UploadFileSetViewModel } from "~/app/upload-documents/models/upload-file-set-view-model";
import { UploadFileSetState } from "~/app/upload-documents/models/upload-file-set-state";
import { FileRepoViewModel } from "~/app/upload-documents/models/file-repo-view-model";
import { FilesApiService } from "~/app/upload-documents/services/files-api.service";
import { filter, take, takeUntil } from "rxjs/internal/operators";
import { NotificationBannerService } from "~/app/shared/services";
import { UploadFinishComponent } from "~/app/upload-documents/components/upload-finish/upload-finish.component";
import { FilesetOutputModel } from '../../models/fileset-output-model';
import { FileRepositoryOutputModel } from "~/app/credit-request/models/fileRepositoryOutputModel";
import { MessagingService } from "~/app/core/services/messaging.service";
import { ProductRequestEvents, UploadDocuments } from "~/app/shared/constants";
import { Subject } from "rxjs";
import { Feature } from "~/app/core/models/feature";
import { UploadFileInputModel } from "~/app/upload-documents/models/upload-file-input-model";
import { UploadFinishedModel } from "~/app/upload-documents/models/upload-finished-model";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { localize } from "nativescript-localize";
import { DialogResult } from "~/app/shared/app.enums";
import { BottomDialogButtonType } from "~/app/shared/models/bottom-dialog.config";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsProductRequestEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: 'omro-upload-main-page',
    templateUrl: './upload-main-page.component.html',
    styleUrls: ['./upload-main-page.component.scss']
})
export class UploadMainPageComponent implements OnInit, OnDestroy {

    private unsubscribe = new Subject();

    public model: FileRepoViewModel = new FileRepoViewModel();
    public uploadFileSetViewModels: UploadFileSetViewModel[] = [];
    public dataLoaded = false;
    public UploadFileSetState = UploadFileSetState;
    public source: Feature;
    public Feature = Feature;

    constructor(private page: Page,
                private ref: ChangeDetectorRef,
                private messagingService: MessagingService,
                private uploadStateService: UploadStateService,
                private routerExtensions: RouterExtensions,
                private activatedRoute: ActivatedRoute,
                private location: Location,
                private cleanupService: FileCleanupService,
                private fileApiService: FilesApiService,
                private notificationBannerService: NotificationBannerService,
                private vcRef: ViewContainerRef,
                private omroModalService: OmroModalService,
                private analyticsService: AnalyticsService) {
                    this.page.actionBarHidden = true;
    }

    @HostListener("loaded")
    public pageInit(): void {
        this.model.uploadFileSets = Array.from(this.uploadStateService.uploadedFiles.values());
        this.uploadFileSetViewModels = this.model.uploadFileSets.map(ufs => new UploadFileSetViewModel(ufs));
    }

    public ngOnInit(): void {
        this.messagingService.getState(UploadDocuments.Input)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(async (input: UploadFileInputModel) => {
                this.setSource(input.source);
                const fileRepo = await this.fileApiService.getFileRepository(input.fileRepositoryId).toPromise();
                this.model = this.createModelFromFileRepo(fileRepo);
                this.model.title = input.pageTitle;
                this.copyFileSets();
                this.populateStateService(this.model);
                this.uploadFileSetViewModels = this.model.uploadFileSets.map(ufs => new UploadFileSetViewModel(ufs));
                this.dataLoaded = true;
            });
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileRepositoryOpen, this.routerExtensions.router.url);
    }

    public async ngOnDestroy(): Promise<void> {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        await this.cleanupService.cleanup();
        this.uploadStateService.clear();
    }

    public onAddDocumentsTapped(item: UploadFileSetViewModel): void {
        if (item.uploadSetState === UploadFileSetState.New) {
            this.redirectTo(`upload/${item.uploadFileSetId}`);
        }
    }

    public onEditDocumentsTapped(item: UploadFileSetViewModel): void {
        if (item.uploadSetState === UploadFileSetState.Editable) {
            this.redirectTo(`upload/${item.uploadFileSetId}`);
        }
    }

    public goBack(): void {
        this.location.back();
    }

    public confirm(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileRepositoryCompleteSubmit, this.routerExtensions.router.url);
            this.fileApiService.setFileRepositoryAsCompleted(this.model.fileRepositoryId, 'ProductRequest')
                .pipe(take(1))
                .subscribe(
                    response => { this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileRepositoryCompleteOK, this.routerExtensions.router.url, response); resolve(); },
                    error => {
                        traceError(error);
                        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileRepositoryCompleteERROR, this.routerExtensions.router.url, error);
                        this.notificationBannerService.showGenericError();
                        reject();
                    });
        });
    }

    public async showConfirmation(): Promise<void> {
        this.omroModalService.showYesNoDialog({
            viewContainerRef: this.vcRef,
            title: localize('ProductRequest.AreYouSure'),
            message:  localize('ProductRequest.ConfirmUploadedAllDocuments'),
            yesButtonType: BottomDialogButtonType.Error
        }).pipe(filter(res => res === DialogResult.Yes))
        .subscribe(async ()=>{
            await this.confirm();
            //const response: boolean = await this.showUploadFinishPage();
            //TODO Emit documentUploadFinished event. Handled by controller
            //setTimeout(() => this.goBack(), 50);
            const setsWithNoUploadedFiles = this.uploadFileSetViewModels.some(fs => fs.uploadedFiles.length < 1);
            this.messagingService.raiseEvent<UploadFinishedModel>(ProductRequestEvents.UploadDocumentsFinished, {
                areFilesUploadedOnAllSets: !setsWithNoUploadedFiles
            });            
        });
    }

    public getImagePath(item: UploadFileSetViewModel): string {
        if (item.uploadSetState === UploadFileSetState.New) {
            return '~/app/images/folder_add_file.svg';
        }
        if (item.uploadSetState === UploadFileSetState.Editable) {
            return '~/app/images/folder_upload_final.svg';
        }
        if (item.uploadSetState === UploadFileSetState.Readonly) {
            return item.uploadedFiles.length === 0 ? '~/app/images/folder_download_inactive.svg' : '~/app/images/folder_download.svg';
        }
        return null;
    }

    public isContinueButtonEnabled(): boolean {

        // if at least one file set is readonly, button should be disabled.
        const someAreReadonly: boolean = this.uploadFileSetViewModels.some(set => set.uploadSetState === UploadFileSetState.Readonly);
        if (someAreReadonly) {
            return false;
        }

        // if at least one file set is New (does not have documents uploaded), button should be disabled
        const someAreNew: boolean = this.uploadFileSetViewModels.some(set => set.uploadSetState === UploadFileSetState.New);
        if (someAreNew) {
            return false;
        }

        // all file sets have documents uploaded
        return true;
    }

    private createModelFromFileRepo(fileRepository: FileRepositoryOutputModel): FileRepoViewModel {
        const model = new FileRepoViewModel();
        model.fileRepositoryId = fileRepository.fileRepositoryId;
        model.details = fileRepository.details;
        model.fileSets = fileRepository.fileSets.map(fs => {
            const fsm: FilesetOutputModel = <FilesetOutputModel> {};
            Object.assign(fsm, fs);
            return fsm;
        });
        return model;
    }

    private showUploadFinishPage(context?: any): Promise<boolean> {
            const options = {
                context: context || {},
                fullscreen: true,
                viewContainerRef: this.vcRef,
                animated: true
            };

        return <Promise<boolean>>this.omroModalService.showModal(UploadFinishComponent, options);
    }

    private redirectTo(path: string): void {
        this.routerExtensions.navigate([path], {
            transition: {
                name: "fade"
            },
            relativeTo: this.activatedRoute
        });
    }

    private populateStateService(fileRepo: FileRepoViewModel): void {
        this.uploadStateService.populateMetadata(fileRepo);
    }

    onDownloadTapped(item: any) {
        this.redirectTo(`upload/${item.uploadFileSetId}`);
    }

    onContinueButtonTapped() {
        const setsWithNoUploadedFiles = this.uploadFileSetViewModels.some(fs => fs.uploadedFiles.length < 1);
        this.messagingService.raiseEvent<UploadFinishedModel>(ProductRequestEvents.UploadDocumentsFinished, {
            areFilesUploadedOnAllSets: !setsWithNoUploadedFiles
        });
        this.goBack();
    }

    private copyFileSets(): void {
        this.model.uploadFileSets = this.model.fileSets.map(fs => <UploadFileSet>{
            setName: fs.setName,
            uploadFileSetId: fs.fileSetId,
            readOnly: fs.readOnly,
            maxFileSize: fs.allowedUploadMaxFileSize,
            maxFileNumber: fs.allowedUploadMaxFileNumber,
            filesUploadedBy: fs.filesUploadedBy,
            details: fs.details,
            allowedFileExtentions: fs.allowedUploadFileExtentions,
            uploadedFiles: fs.uploadedFiles
        });
    }

    private setSource(source: Feature): void {
        this.source = source;
        this.uploadStateService.source = source;
    }
}
