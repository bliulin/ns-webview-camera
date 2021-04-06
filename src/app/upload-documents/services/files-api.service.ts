import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { APP_CONFIG } from "~/app/core/environment";
import { FileRepositoryOutputModel } from "~/app/credit-request/models/fileRepositoryOutputModel";

@Injectable({providedIn:"root"})
export class FilesApiService {
    constructor(private httpClient: HttpClient) {
    }

    public deleteFile(fileId: string): Observable<any> {
        const url = APP_CONFIG.baseUrl + 'Private/deletefile?fileRepositoryFileSetFileId=' + fileId;
        return this.httpClient.delete(url);
    }

    public setFileRepositoryAsCompleted(fileRepositoryId: string, scope: string): Observable<any> {
        const url = APP_CONFIG.baseUrl + 'Private/setfilerepositoryascompleted';
        const model = {
            fileRepositoryId: fileRepositoryId,
            scope: scope
        };
        return this.httpClient.post(url, model);
    }

    public setFileSetAsCompleted(fileSetId: string): Observable<any> {
        const url = `${APP_CONFIG.baseUrl}Private/setfilesetascompleted?fileRepositoryFileSetId=${fileSetId}`;

        const model = {};
        return this.httpClient.post(url, model);
    }

    public getFileRepository(fileRepositoryId: string): Observable<FileRepositoryOutputModel> {
        const url = APP_CONFIG.baseUrl + 'Private/filerepository?fileRepositoryId=' + fileRepositoryId;
        return this.httpClient.get<FileRepositoryOutputModel>(url);
    }
}
