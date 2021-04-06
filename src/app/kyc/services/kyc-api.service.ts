import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { APP_CONFIG } from "../../../app/core/environment";
import { UserKYCOutputModel } from "~/app/kyc/models/userKYCOutputModel";

@Injectable()
export class KycApiService {

  constructor(private httpClient: HttpClient) { }

  public initKycProcess(): Observable<UserKYCOutputModel> {
    const initKycUrl = APP_CONFIG.baseUrl + 'Private/initkyc';
    return this.httpClient.post(initKycUrl, {});
  }

  public userCompletedKycProcess(productRequestId: string, sessionId: string): Observable<any> {
    const userCompletedKycUrl = APP_CONFIG.baseUrl + 'Private/usercompletedkyc';
    const body = {productRequestId, sessionId};
    return this.httpClient.post(userCompletedKycUrl, body);
  }
}
