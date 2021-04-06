import { ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit, ViewContainerRef } from "@angular/core";
import { UploadStateService } from "~/app/upload-documents/services/upload-state.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { DocTypeMapper } from '../../services/doc-type-mapper';
import { FileInfo } from "~/app/core/models/file-info";
import { localize } from "nativescript-localize";
import { traceError } from "~/app/core/logging/logging-utils";
import { forkJoin, Subject } from "rxjs";
import { File } from "tns-core-modules/file-system";
import { UnlockService } from "~/app/core/services/unlock.service";
import { CancelToken } from "~/app/core/services/cancelToken";
import { FilePickerService } from "../../services/file-picker/file-picker-service";
import { filePickerServiceProvider } from "~/app/upload-documents/services/file-picker/file-picker-service.provider";
import { PickerOptions } from "~/app/upload-documents/models/picker-options";
import { FileUploadViewModel } from "~/app/upload-documents/models/file-upload-view-model";
import { UploadFileSetViewModel } from "~/app/upload-documents/models/upload-file-set-view-model";
import { UploadedFileViewModel } from "~/app/upload-documents/models/uploaded-file-view-model";
import { NotificationBannerService } from "~/app/shared/services";
import { FilesApiService } from "~/app/upload-documents/services/files-api.service";
import { take } from "rxjs/internal/operators";
import { OpenFileService } from "~/app/upload-documents/services/open-file.service";
import { Feature } from "~/app/core/models/feature";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { DialogResult } from "~/app/shared/app.enums";
import { BottomDialogButtonType } from "~/app/shared/models/bottom-dialog.config";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsProductRequestEvents } from "~/app/core/models/app-insights-events";
import { RouterExtensions } from "nativescript-angular";

@Component({
    selector: 'omro-upload-on-set',
    templateUrl: './upload-on-set.component.html',
    styleUrls: ['./upload-on-set.component.scss'],
    providers: [filePickerServiceProvider, OpenFileService]
})
export class UploadOnSetComponent implements OnInit, OnDestroy {
    public addDocumentsVisible: boolean;
    public fileViewModels: FileUploadViewModel[] = [];
    public isFileSelectionActivated: boolean;
    public source: Feature;

    public Feature = Feature;

    public uploadFileSetViewModel: UploadFileSetViewModel;
    private unsubscribe$: Subject<any> = new Subject<any>();
    private cancelToken: CancelToken;

    private readonly TIMEOUT: number = 60000;

    constructor(private uploadStateService: UploadStateService,
                private ref: ChangeDetectorRef,
                private activatedRoute: ActivatedRoute,
                private location: Location,
                private ngZone: NgZone,
                private unlockService: UnlockService,
                private filePicker: FilePickerService,
                private notificationBannerService: NotificationBannerService,
                private fileApiService: FilesApiService,
                private confirmationDialogService: OmroModalService,
                private vcRef: ViewContainerRef,
                private analyticsService: AnalyticsService,
                private routerExtensions: RouterExtensions
                ) {
    }

    public get hasItemsUploaded(): boolean {
        if (!this.uploadFileSetViewModel) {
            return false;
        }
        return this.uploadFileSetViewModel.uploadedFiles.length > 0;
    }

    public ngOnInit(): void {
        const uploadFileSetId = this.activatedRoute.snapshot.paramMap.get('uploadFileSetId');
        const ufs = this.uploadStateService.uploadedFiles.get(uploadFileSetId);
        this.uploadFileSetViewModel = new UploadFileSetViewModel(ufs);
        this.populateFileViewModels(this.uploadFileSetViewModel.uploadedFiles);
        this.addDocumentsVisible = this.hasItemsUploaded || ufs.readOnly === true;
        this.source = this.uploadStateService.source;
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetOpen, this.routerExtensions.router.url);
    }

    public ngOnDestroy(): void {
        this.signalUnsubscribe();
        if (this.cancelToken) {
            this.cancelToken.cancel();
        }
    }

    public onAddDocumentsTapped(): void {
        this.addDocumentsVisible = true;
    }

    public onAddFiles(): void {
        this.cancelToken = this.unlockService.enableLocklessSuspend();
        const allowedExt = this.uploadFileSetViewModel.allowedFileExtentions.map(ext => ext.replace('.', ''));
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetUploadStart, this.routerExtensions.router.url);
        this.filePicker.openFilePicker(<PickerOptions>{
            allowedExtensions: allowedExt,
            maxFiles: this.uploadFileSetViewModel.maxFileNumber || undefined
        })
            .then((files: File[]) => {
                traceError('Selected files: ' + files.length);
                if (this.cancelToken) {
                    this.cancelToken.cancel();
                }
                this.createFileComponents(files);
            }).catch((err) => {
            traceError('Failed to select files: ' + err);
            if (this.cancelToken) {
                this.cancelToken.cancel();
            }
        });
    }

    public goBack(): void {
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetBack, this.routerExtensions.router.url);
        this.location.back();
    }

    public isFinalizeUploadButtonEnabled(): boolean {
        return this.uploadFileSetViewModel.uploadedFiles.length > 0;
    }

    public get showButtons(): boolean {
        return !this.uploadFileSetViewModel.readOnly;
    }

    private signalUnsubscribe(): void {
        if (this.unsubscribe$) {
            this.unsubscribe$.next();
            this.unsubscribe$.complete();
        }
    }

    deleteSelectedFiles() {
        const deletedFiles = this.fileViewModels.filter(f => f.isSelected);
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetDeleteSubmit, this.routerExtensions.router.url, deletedFiles);
        const requests = deletedFiles.map(file => this.fileApiService.deleteFile(file.fileId));
        forkJoin(requests)
            .pipe(take(1))
            .subscribe(val => {
            this.fileViewModels = this.fileViewModels.filter(f => !f.isSelected);
            deletedFiles.forEach(file => {
                const index = this.uploadFileSetViewModel.uploadedFiles.findIndex(f => f.fileId === file.fileId);
                if (index >= 0) {
                    this.uploadFileSetViewModel.uploadedFiles.splice(index, 1);
                }
                this.removeFromState(file.fileId);
            });
            this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetDeleteOK, this.routerExtensions.router.url, val);
        }, error => {
            traceError(error);
            this.notificationBannerService.showError({
                    title: localize('ProductRequest.Error_DeleteFile'),
                    detail: localize("ProductRequest.Error_FailedToDelete")
                },
                this.TIMEOUT);
            this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetDeleteERROR, this.routerExtensions.router.url, error);
        });
    }

    public onFileUploadedSuccess(file: FileUploadViewModel): void {
        const uploadedFileVm = UploadedFileViewModel.createFrom(file);
        this.uploadFileSetViewModel.uploadedFiles.push(uploadedFileVm);
        this.storeInState(uploadedFileVm);

        // sometimes the progress bar does not disappear after reaching 100%
        this.ref.detectChanges();
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetUploadOK, this.routerExtensions.router.url, uploadedFileVm);
    }

    public onFileUploadedError(file: FileUploadViewModel): void {
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetUploadERROR, this.routerExtensions.router.url, file);
        this.notificationBannerService.showError({
                title: localize('ProductRequest.Error_Upload'),
                detail: localize("ProductRequest.Error_FailedToUpload")
            },
            this.TIMEOUT);
    }

    onToggleSelection(activated: boolean) {
        this.isFileSelectionActivated = activated;
    }

    onFileDownloadedError($event: FileUploadViewModel) {
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetDownloadERROR, this.routerExtensions.router.url, $event);
        this.notificationBannerService.showError({
                title: localize('ProductRequest.Error_Download'),
                detail: localize("ProductRequest.Error_FailedToDownload")
            },
            this.TIMEOUT);
    }

    onFileDownloadedSuccess(fileVm: FileUploadViewModel) {
        const uploadedFile = this.uploadFileSetViewModel.uploadedFiles.find(file => file.fileId === fileVm.fileId);
        uploadedFile.path = fileVm.path;
        this.storeInState(uploadedFile);
        this.ref.detectChanges();
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetDownloadOK, this.routerExtensions.router.url, uploadedFile);
    }

    onFinalizeUpload() {
        this.confirmAllDocsUploaded(() => {
            this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetComplete, this.routerExtensions.router.url);
            this.goBack();
        });
    }

    onContinueLater() {
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.FileSetContinueLater, this.routerExtensions.router.url);
        this.goBack();
    }

    private confirmAllDocsUploaded(callback: () => void): void {
        this.confirmationDialogService.showBottomDialog(
            {
                viewContainerRef: this.vcRef,
                title: localize('ProductRequest.AreYouSure'),
                message: localize('ProductRequest.ConfirmUploadedAllDocuments'),
                actions: [
                    {
                        buttonType: BottomDialogButtonType.Error,
                        text: localize('Common.Yes'),
                        result: DialogResult.Yes
                    },
                    {
                        buttonType: BottomDialogButtonType.Transparent,
                        text: localize('Common.No'),
                        result: DialogResult.No
                    }
                ]
            }
        ).subscribe(res => {
            if (res === 'Yes') {
                console.log("Response: " + res);
                setTimeout( () => callback(), 100);
            }
        });
    }

    private createFileComponents(files: File[]): void {
        const fileInfos = files.map<FileInfo>(file => <FileInfo>{
            path: file.path,
            mimeType: DocTypeMapper.getMimeTypeFrom(file.path),
            sizeInBytes: file.size
        });

        let allowedFiles = [];
        if (this.uploadFileSetViewModel.maxFileNumber > 0) {
            const maxNumberOfFiles = this.uploadFileSetViewModel.maxFileNumber;
            const noOfFilesUploaded = this.uploadFileSetViewModel.uploadedFiles.length;
            const noOfFilesAllowed = maxNumberOfFiles - noOfFilesUploaded;

            allowedFiles = fileInfos.slice(0, noOfFilesAllowed);
        }
        else {
            allowedFiles = fileInfos;
        }
        if (allowedFiles.length !== fileInfos.length) {
            this.notificationBannerService.showError({
                    title: localize('ProductRequest.Error_Upload'),
                    detail: localize("ProductRequest.Error_TooManyFiles")
                },
                this.TIMEOUT);
        }

        const count = allowedFiles.length;
        const vms = allowedFiles
            .filter(fi => this.uploadFileSetViewModel.maxFileSize === 0 || fi.sizeInBytes <= this.uploadFileSetViewModel.maxFileSize)
            .map(fi => FileUploadViewModel.createUploadingFile(fi, this.uploadFileSetViewModel.uploadFileSetId));
        if (vms.length < count) {
            this.notificationBannerService.showError({
                    title: localize('ProductRequest.Error_Upload'),
                    detail: localize("ProductRequest.Error_FileTooLarge")
                },
                this.TIMEOUT);
        }

        this.ngZone.run(() => {
            this.fileViewModels.push(...vms);
            this.ref.detectChanges();
        });
    }

    private populateFileViewModels(files: UploadedFileViewModel[]): void {
        this.fileViewModels = [];
        files.forEach(file => {
            this.fileViewModels.push(FileUploadViewModel.createUploadedFile(file));
        });
    }

    private storeInState(uploadedFileVm: UploadedFileViewModel): void {
        const uploadFileSetId = this.uploadFileSetViewModel.uploadFileSetId;
        const ufs = this.uploadStateService.uploadedFiles.get(uploadFileSetId);
        if (!ufs.uploadedFiles) {
            ufs.uploadedFiles = [];
        }
        const existingFileIndex = ufs.uploadedFiles.findIndex(f => f.fileId === uploadedFileVm.fileId);
        if (existingFileIndex < 0) {
            ufs.uploadedFiles.push(uploadedFileVm);
        }
        else {
            const existingFile = ufs.uploadedFiles[existingFileIndex];
            const fileOnDisk = new UploadedFileViewModel(existingFile);
            fileOnDisk.path = uploadedFileVm.path;
            ufs.uploadedFiles.splice(existingFileIndex, 1, fileOnDisk);
        }
    }

    private markFileSetAsReadonlyInState(fileSetId: string): void {
        const uploadFileSetId = this.uploadFileSetViewModel.uploadFileSetId;
        const ufs = this.uploadStateService.uploadedFiles.get(uploadFileSetId);
        ufs.readOnly = true;
    }

    private removeFromState(fileId: string): void {
        const uploadFileSetId = this.uploadFileSetViewModel.uploadFileSetId;
        const ufs = this.uploadStateService.uploadedFiles.get(uploadFileSetId);
        const index = ufs.uploadedFiles.findIndex(f => f.fileId === fileId);
        if (index >= 0) {
            ufs.uploadedFiles.splice(index, 1);
        }
    }
}
