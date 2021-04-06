import { Injectable } from "@angular/core";
import { BackgroundHttpService } from "~/app/core/services/background-http-service";
import { EventData } from 'tns-core-modules/data/observable';
import { FileInfo } from "~/app/core/models/file-info";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/internal/operators";
import { CompleteEventData, ErrorEventData, ProgressEventData } from "nativescript-background-http";
import { APP_CONFIG } from "~/app/core/environment";

@Injectable()
export class FileUploadService {
    private readonly url: string = APP_CONFIG.baseUrl + 'Private/uploadbinaryfile';

    constructor(private uploadService: BackgroundHttpService) {
    }

    public get progress$(): Observable<ProgressEventData> {
        return this.getUploadStream<ProgressEventData>('progress');
    }

    public get complete$(): Observable<CompleteEventData> {
        return this.getUploadStream<CompleteEventData>('complete');
    }

    public get error$(): Observable<ErrorEventData> {
        return this.getUploadStream<ErrorEventData>('error');
    }

    public beginUpload(uploadSetId: string, file: FileInfo): void {
        this.uploadService.beginUploadFile(this.url, file, [{
            name: 'fileSetId',
            value: uploadSetId
        }]);
    }

    private getUploadStream<T extends EventData>(eventName: string): Observable<T> {
        return this.uploadService.$uploadEventStream.pipe(
            filter(evt => evt.eventName === eventName),
            map(evt => <T> evt)
        );
    }
}
