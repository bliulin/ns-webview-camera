import { Injectable } from "@angular/core";
import { knownFolders, Folder, File, path } from "tns-core-modules/file-system";
import { isAndroid } from "tns-core-modules/platform";
import { traceDebug, traceError } from "~/app/core/logging/logging-utils";
import { DownloadProgress, RequestOptions } from "nativescript-download-progress";
import { APP_CONFIG } from "~/app/core/environment";
import { Observable, Subject } from "rxjs";
import { CompleteEventData, ErrorEventData, ProgressEventData } from "nativescript-background-http";
import { HttpRequestService } from "~/app/core/authentication/http-request.service";
const permissions = require("nativescript-permissions");

@Injectable()
export class FileDownloadService {

    private downloadProgress: Subject<ProgressEventData> = new Subject<ProgressEventData>();
    private downloadComplete: Subject<CompleteEventData> = new Subject<CompleteEventData>();
    private downloadError: Subject<ErrorEventData> = new Subject<ErrorEventData>();

    constructor(private httpRequestService: HttpRequestService) {}

    public get progress$(): Observable<ProgressEventData> {
        return this.downloadProgress;
    }

    public get complete$(): Observable<CompleteEventData> {
        return this.downloadComplete;
    }

    public get error$(): Observable<ErrorEventData> {
        return this.downloadError;
    }

    public beginDownload(fileInfo: {fileId: string, filename: string}): void {

        const download = new DownloadProgress();

        download.addProgressCallback(progress => {
            console.log('Progress:', progress);
            this.emitProgress(progress);
        });

        const url = APP_CONFIG.baseUrl + `Private/downloadFile?fileRepositoryFileSetFileId=${fileInfo.fileId}`;

        let downloadPath = '';
        if (isAndroid) {
            const androidDownloadsPath = android.os.Environment.getExternalStoragePublicDirectory(
                android.os.Environment.DIRECTORY_DOWNLOADS).toString();
            downloadPath = androidDownloadsPath;
        }
        else {
            downloadPath = knownFolders.documents().path;
        }

        const filename = fileInfo.filename;

        this.requestWritePermission()
            .then(() => {
                traceDebug('Permission granted!');
                traceDebug('starting download in location: ' + downloadPath);

                const requestOptions: RequestOptions = {
                    method: "GET",
                    headers: this.getRequestHeaders()
                };

                downloadPath = path.join(downloadPath, filename);
                download.downloadFile(url, requestOptions, downloadPath).then((file: File) => {
                    traceDebug("Success in download: " + file.path);
                    this.complete(downloadPath);
                }).catch(error => {
                    traceError("Error in download: " + error);
                    this.reject(error);
                });
            })
            .catch(error => {
                traceDebug('No permission granted');
                this.reject(error);
            });
    }

    private getRequestHeaders(): any {
        return this.httpRequestService.getStandardHttpHeadersReduced();
    }

    private requestWritePermission(): Promise<any> {
        if (isAndroid) {
            return permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "");
        }
        return Promise.resolve();
    }

    private reject(error: any): void {
        this.downloadError.next({
            eventName: 'error',
            error: error,
            response: null,
            responseCode: -1,
            object: null
        });
    }

    private complete(path: string): void {
        this.downloadComplete.next({
            response: path,
            responseCode: 0,
            eventName: 'complete',
            object: null
        });
    }

    private emitProgress(progress: any): void {
        this.downloadProgress.next({
            currentBytes: progress * 100,
            totalBytes: 100,
            eventName: 'progress',
            object: null
        });
    }
}
