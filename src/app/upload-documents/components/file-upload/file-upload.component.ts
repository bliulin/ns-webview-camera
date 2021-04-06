import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { FileUploadViewModel } from '~/app/upload-documents/models/file-upload-view-model';
import { FileUploadService } from '~/app/upload-documents/services/file-upload.service';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/internal/operators';
import { CompleteEventData, ErrorEventData, ProgressEventData } from 'nativescript-background-http';
import { traceDebug, traceError } from '~/app/core/logging/logging-utils';
import { FileInfo } from '~/app/core/models/file-info';
import { BackgroundHttpService } from '~/app/core/services/background-http-service';
import { OperationProgress } from '~/app/core/models/operation-progress';
import { FilesApiService } from '~/app/upload-documents/services/files-api.service';
import { OpenFileService } from '~/app/upload-documents/services/open-file.service';
import { FileDownloadService } from '~/app/upload-documents/services/file-download.service';
import { isAndroid } from 'tns-core-modules/platform';
import { UploadedFileViewModel } from '~/app/upload-documents/models/uploaded-file-view-model';
import { UploadStateService } from '~/app/upload-documents/services/upload-state.service';

@Component({
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
    selector: 'omro-file-upload',
    providers: [FileUploadService, BackgroundHttpService, FileDownloadService]
})
export class FileUploadComponent implements OnInit, OnDestroy, OnChanges {
    @Input()
    public isAddCardPlaceholder: boolean;

    @Input()
    public file: FileUploadViewModel;

    @Input()
    public isSelectionMode: boolean;

    @Input()
    public isReadOnly: boolean;

    @Output()
    public itemTapped: EventEmitter<void> = new EventEmitter();

    @Output()
    public fileUploadedSuccess: EventEmitter<FileUploadViewModel> = new EventEmitter();

    @Output()
    public fileUploadedError: EventEmitter<FileUploadViewModel> = new EventEmitter();

    @Output()
    public fileDownloadedSuccess: EventEmitter<FileUploadViewModel> = new EventEmitter<FileUploadViewModel>();

    @Output()
    public fileDownloadedError: EventEmitter<FileUploadViewModel> = new EventEmitter<FileUploadViewModel>();

    public uploadProgress: OperationProgress;
    public downloadProgress: OperationProgress;

    @ViewChild('fileNameLabel', { static: false })
    private fileNameLabel: any;
    private unsubscribe$: Subject<any> = new Subject<any>();

    constructor(
        private fileUploadService: FileUploadService,
        private fileDownloadService: FileDownloadService,
        private openFileService: OpenFileService,
        private fileApiService: FilesApiService,
        private uploadStateService: UploadStateService,
        private ngZone: NgZone
    ) {}

    public ngOnInit(): void {
        if (!this.file || !this.file.isUploading) {
            return;
        }

        this.startUpload();
    }

    public ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!this.isSelectionMode && this.file) {
            this.file.isSelected = false;
        }
    }

    public get showProgress(): boolean {
        return this.file.isUploading || this.file.isDownloading;
    }

    public get total(): number {
        if (this.file.isUploading) {
            return this.uploadProgress.total;
        }
        if (this.file.isDownloading) {
            return this.downloadProgress.total;
        }
        return 0;
    }

    public get current(): number {
        if (this.file.isUploading) {
            return this.uploadProgress.current;
        }
        if (this.file.isDownloading) {
            return this.downloadProgress.current;
        }
        return 0;
    }

    public onTap(): void {
        if (this.isSelectionMode) {
            if (!this.file.isUploading) {
                this.file.isSelected = !this.file.isSelected;
            }
        } else {
            if (this.isReadOnly && !this.file.path) {
                this.startDownload();
            } else {
                this.openFileService.openFile(this.file.path);
            }
        }
        this.itemTapped.emit();
    }

    public onRetry(): void {
        this.file.isError = false;
        this.markAsUploading();
        this.fileUploadService.beginUpload(this.file.uploadFileSetId, this.file.fileInfo);
    }

    public onAddfiles(): void {
        this.itemTapped.emit();
    }

    private subscribeToUploadEvents(): void {
        this.fileUploadService.progress$.pipe(takeUntil(this.unsubscribe$)).subscribe((evt: ProgressEventData) => {
            traceDebug(`[UploadFiles] Progress ${evt.currentBytes} out of ${evt.totalBytes}`);
            this.ngZone.run(() => {
                this.uploadProgress.current = evt.currentBytes;
                this.uploadProgress.total = evt.totalBytes;
            });
        });

        this.fileUploadService.complete$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((evt: CompleteEventData) => {
                traceDebug('[UploadFile] Completed!');
                this.ngZone.run(async () => {
                    let fileId = null;
                    if (isAndroid) {
                        fileId = evt.response.getBodyAsString().replace(/"/g, "");
                    }
                    else {
                        // HTTP errors end up here on iOS, so first check if this is not an error.
                        const responseCode = evt.responseCode;
                        if (responseCode < 200 || responseCode > 299) {
                            traceError('There was an error uploading the document! Status code = ' + responseCode);
                            this.markAsError(responseCode);
                            return;
                        }

                        // on iOS this library is not able to get the http response body, which contains the fileId
                        // we have to get this value from the HTTP header.
                        if (evt.response.valueForHTTPHeaderField) {
                            fileId = evt.response.valueForHTTPHeaderField('X-FileId');
                        }
                        else if (evt.response.allHeaderFields) {
                            fileId = evt.response.allHeaderFields.valueForKey('X-FileId');
                        }
                    }
                    traceDebug("FILE ID received from server: " + fileId);
                    this.unMarkAsUploading();
                    this.file.fileId = fileId;
                    this.fileUploadedSuccess.emit(this.file);
                });
            });

        this.fileUploadService.error$
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((evt: ErrorEventData) => {
                let error = evt.error;
                if (isAndroid) {
                    error = evt.response.getBodyAsString();
                }
                traceError('[UploadFiles] Error from server: ' + error);

                this.ngZone.run(() => {
                    this.markAsError(evt.error);
                });
            });
    }

    private markAsError(error: any): void {
        this.unMarkAsUploading();
        this.file.isError = true;
        this.file.error = error;
        this.fileUploadedError.emit(this.file);
    }

    private subscribeToDownloadEvents(): void {
        this.fileDownloadService.progress$.pipe(takeUntil(this.unsubscribe$)).subscribe((evt: ProgressEventData) => {
            traceDebug(`[DownloadFile] Progress ${evt.currentBytes} out of ${evt.totalBytes}`);
            this.ngZone.run(() => {
                this.downloadProgress.current = evt.currentBytes;
                this.downloadProgress.total = evt.totalBytes;
            });
        });
        this.fileDownloadService.complete$.pipe(takeUntil(this.unsubscribe$)).subscribe((evt: CompleteEventData) => {
            traceDebug('[DownloadFile] Completed!');
            this.ngZone.run(() => {
                this.unMarkAsDownload();
                this.file.fileInfo.path = evt.response;
                this.fileDownloadedSuccess.emit(this.file);
            });
        });
        this.fileDownloadService.error$.pipe(takeUntil(this.unsubscribe$)).subscribe((evt: ErrorEventData) => {
            traceError('[DownloadFile] Error: ' + evt.error);
            this.ngZone.run(() => {
                this.unMarkAsDownload();
                this.file.isError = true;
                this.file.error = evt.error;
                this.fileDownloadedError.emit(this.file);
            });
        });
    }

    private startUpload(): void {
        this.markAsUploading();
        this.subscribeToUploadEvents();
        this.fileUploadService.beginUpload(this.file.uploadFileSetId, this.file.fileInfo);
    }

    private startDownload(): void {
        this.markAsDownloading();
        this.subscribeToDownloadEvents();
        this.fileDownloadService.beginDownload({ fileId: this.file.fileId, filename: this.file.fileName });
    }

    private markAsUploading(): void {
        this.file.isUploading = true;
        this.uploadProgress = {
            total: this.file.fileInfo.sizeInBytes,
            current: 0
        };
    }

    private unMarkAsUploading(): void {
        this.file.isUploading = false;
        this.uploadProgress.current = 0;
    }

    private markAsDownloading(): void {
        this.file.isDownloading = true;
        this.downloadProgress = {
            total: 100,
            current: 0
        };
    }

    private unMarkAsDownload(): void {
        this.file.isDownloading = false;
        this.downloadProgress.current = 0;
    }
}
