import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductRequestOutputModel } from '../models/productRequestOutputModel';
import { APP_CONFIG } from '~/app/core/environment';
import { ProductRequestFlowOutputModel } from '~/app/credit-request/models/productRequestFlowOutputModel';
import { ProductRequestModel } from '~/app/credit-request/models/productRequestModel';
import { Injectable } from '@angular/core';
import { ProductOfferModel } from '~/app/credit-request/models/productOfferModel';
import { ProductRequestCancelationReasonOutputModel } from '~/app/credit-request/models/productRequestCancelationReasonOutputModel';

const checkOfferStatusApiUrl = 'Private/checkproductofferstatus';

const requestNewProductApiUrl = 'Private/requestnewproduct';

const sendApprovalApiUrl = 'Private/sendapproval';

@Injectable({
    providedIn: 'root'
})
export class CreditRequestApiService {
    constructor(private httpClient: HttpClient) {
    }

    public getProductRequestFlow(productRequestId: string): Observable<ProductRequestFlowOutputModel> {
        const url = APP_CONFIG.baseUrl + 'Private/productrequestflow';
        return this.httpClient.get<ProductRequestFlowOutputModel>(url, {
            params: {productRequestId}
        });
    }

    public requestNewProduct(productRequestModel: ProductRequestModel): Observable<ProductRequestFlowOutputModel> {
        let httpHeaders = new HttpHeaders();
        return this.httpClient.post<ProductRequestFlowOutputModel>(
            `${APP_CONFIG.baseUrl}${requestNewProductApiUrl}`,
            productRequestModel,
            {headers: httpHeaders}
        );
    }

    public checkOfferStatus(productRequestId: string): Observable<string> {
        let httpHeaders = new HttpHeaders({"X-BackgroundRequest": "true"});
        return this.httpClient.post<string>(`${APP_CONFIG.baseUrl}${checkOfferStatusApiUrl}`,
            {productRequestId},
            {
                responseType: 'text' as 'json',
                headers: httpHeaders
            });
    }

    public cancelProductRequest(productRequestId: string, cancelationCodes: string[] = []): Observable<any> {
        const url = APP_CONFIG.baseUrl + 'Private/cancelproductrequest';
        const body = {productRequestId, cancelationCodes};
        return this.httpClient.post(url, body);
    }

    public acceptOffer(productOfferModel: ProductOfferModel): Observable<ProductRequestFlowOutputModel> {
        const url = APP_CONFIG.baseUrl + 'Private/acceptoffer';
        return this.httpClient.post<ProductRequestFlowOutputModel>(url, productOfferModel);
    }

    public productRequestCancelationReasons(): Observable<ProductRequestCancelationReasonOutputModel> {
        const url = APP_CONFIG.baseUrl + 'Private/productrequestcancelationreasons';
        return this.httpClient.get<ProductRequestCancelationReasonOutputModel>(url);
    }

    public sendApproval(productRequestFlowStageId: string): Observable<ProductRequestFlowOutputModel> {
        return this.httpClient.post<ProductRequestFlowOutputModel>(`${APP_CONFIG.baseUrl}${sendApprovalApiUrl}?productRequestFlowStageId=${productRequestFlowStageId}`, {});
    }
}
