import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AppStatusResponse } from "./app-status-response";
import { APP_CONFIG } from "../core/environment";

@Injectable()
export class AppStatusHttpService {
    public constructor(private httpClient: HttpClient) {}

    public getAppStatusResponse(sessionId: string): Observable<AppStatusResponse> {
        let httpHeaders = new HttpHeaders();
        httpHeaders = httpHeaders.set('X-Client-SessionId', sessionId);
        httpHeaders = httpHeaders.set('X-BackgroundRequest', '');
        return this.httpClient.get<AppStatusResponse>(APP_CONFIG.baseUrl + 'Public/info', { headers: httpHeaders });
    }
}
