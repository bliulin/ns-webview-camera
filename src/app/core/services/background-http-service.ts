import { Injectable } from "@angular/core";
import * as bgHttp from "nativescript-background-http";
import { EventData } from 'tns-core-modules/data/observable';
import { APP_CONFIG } from "~/app/core/environment";
import { traceDebug } from "~/app/core/logging/logging-utils";
import { FileInfo } from "~/app/core/models/file-info";
import { Subject } from "rxjs";
import { Guid } from "guid-typescript";
import * as appSettings from "tns-core-modules/application-settings";
import { AppStatus } from "~/app/shared/constants";
import { HttpRequestService } from "../authentication/http-request.service";

@Injectable()
export class BackgroundHttpService {
    private url: string;
    public $uploadEventStream: Subject<EventData> = new Subject();

    constructor(private httpRequestService: HttpRequestService) {
        traceDebug('ctor Backgorund HTTP service called');
    }

    public startSession(): any {
        const id = Guid.create().toString();
        const session = bgHttp.session(id);
        return session;
    }

    public beginUploadFiles(url: string, fileInfoList: FileInfo[], params: { name: string, value: string }[], session?: any): any {
        this.url = url;
        if (fileInfoList.length > 0) {
            session = this.startUpload(fileInfoList, params, session);
        }
        return session;
    }

    public beginUploadFile(url: string, fileInfo: FileInfo, params: { name: string, value: string }[], session?: any): any {
        this.url = url;
        return this.startUploadFile(fileInfo, params, session);
    }

    private startUploadFile(fileInfo: FileInfo, params: {name: string, value: string}[], session?: any): any {
        if (!session) {
            session = this.startSession();
        }

        if (!params) {
            params = [];
        }

        // fix for ios
        const filePath = fileInfo.path.indexOf('file://') === 0 ? fileInfo.path.substr(7) : fileInfo.path;
        const fileName = filePath.substr(filePath.lastIndexOf("/") + 1);
        this.url += '?fileName=' + fileName;

        const fileSetIdParam = params.find(p => p.name === 'fileSetId');
        const fileSetId = fileSetIdParam ? fileSetIdParam.value : null;
        const request = {
            url: this.url,
            method: "POST",
            headers: this.getExtendedHeaders(fileSetId),
            description: "Uploading " + fileName,
            androidAutoDeleteAfterUpload: false,
            androidNotificationTitle: 'Uploading file...',
            androidDisplayNotificationProgress: true,
            androidAutoClearNotification: true
        };

        const task = session.uploadFile(filePath, request);
        task.on("progress", this.onEvent.bind(this));
        task.on("error", this.onEvent.bind(this));
        task.on("responded", this.onEvent.bind(this));
        task.on("complete", this.onEvent.bind(this));

        return session;
    }

    private startUpload(fileInfoList: FileInfo[], params: { name: string, value: string }[], session?: any): any {

        if (!session) {
            session = this.startSession();
        }

        if (!params) {
            params = [];
        }

        const requestParams = [...params] as any[];

        let i = 0;
        fileInfoList.forEach(fileInfo => {

            // fix for ios
            const filePath = fileInfo.path.indexOf('file://') === 0 ? fileInfo.path.substr(7) : fileInfo.path;

            requestParams.push({
                name: "filename-" + (++i).toString(),
                filename: filePath,
                mimeType: fileInfo.mimeType
            });
        });

        const request = {
            url: this.url,
            method: "POST",
            headers: this.getHeaders(),
            androidAutoDeleteAfterUpload: false,
            androidNotificationTitle: 'Uploading files...',
            androidDisplayNotificationProgress: true,
            androidAutoClearNotification: true
        };

        const task: bgHttp.Task = session.multipartUpload(requestParams, request);

        task.on("progress", this.onEvent.bind(this));
        task.on("error", this.onEvent.bind(this));
        task.on("responded", this.onEvent.bind(this));
        task.on("complete", this.onEvent.bind(this));

        return session;
    }

    private getHeaders(): any {
        const headers = this.httpRequestService.getStandardHttpHeadersReduced();
        headers["Content-Type"] = 'application/octet-stream';
        return headers;
    }

    private getExtendedHeaders(fileSetId: string): any {
        const headers = this.httpRequestService.getStandardHttpHeadersReduced();
        headers['Content-Type'] = 'application/octet-stream';
        headers['X-FileRepositoryFileSetId'] = fileSetId;
        return headers;
    }

    private onEvent(e: any): void {
        const event = {
            eventTitle: e.eventName + " " + e.object.description,
            eventData: {
                error: e.error ? e.error.toString() : e.error,
                currentBytes: e.currentBytes,
                totalBytes: e.totalBytes,
                body: e.data,
                responseCode: e.responseCode
            }
        };
        traceDebug("    http event: " + JSON.stringify(event));
        this.$uploadEventStream.next(e);
    }
}
