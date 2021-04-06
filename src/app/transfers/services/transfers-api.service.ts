import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '~/app/core/environment';
import {
    PartnerModel,
    PartnerOutputModel,
    PaymentModel,
    AddedPaymentOutputModel,
    ConfirmedPaymentOutputModel,
    PartnerAccountsModel
} from '../models/api';
import { TransferModel } from '~/app/transfers/models/api/transferModel';
import { AddedTransferOutputModel } from '~/app/transfers/models/api/addedTransferOutputModel';
import { TransactionInfoModel } from '~/app/transfers/models/api/transactionInfoModel';
import { ConfirmedTransferOutputModel } from '~/app/transfers/models/api/confirmedTransferOutputModel';

const getTransfersApiUrl = 'Private/partners';
const createNewPartnerApiUrl = 'Private/partner';
const addTransferApiUrl = 'Private/transaction/add-transfer';
const cancelTransferApiUrl = 'Private/transaction/cancel-transfer';
const confirmTransferApiUrl = 'Private/transaction/confirm-transfer';
const addPaymentApiUrl = 'Private/transaction/add-payment';
const confirmPaymentApiUrl = 'Private/transaction/confirm-payment';
const cancelPaymentApiUrl = 'Private/transaction/cancel-payment';
const addAccountsToPartnerApiUrl = 'Private/partner/accounts';

@Injectable({ providedIn: 'root' })
export class TransfersApiService {
    constructor(private httpClient: HttpClient) {}

    public get(): Observable<PartnerOutputModel[]> {
        return this.httpClient.get<PartnerOutputModel[]>(`${APP_CONFIG.baseUrl}${getTransfersApiUrl}`, {
            headers: this.getHttpHeaders(false)
        });
    }

    public addNewPartner(createModel: PartnerModel): Observable<PartnerOutputModel> {
        return this.httpClient.post<PartnerOutputModel>(`${APP_CONFIG.baseUrl}${createNewPartnerApiUrl}`, createModel, {
            headers: this.getHttpHeaders(false)
        });
    }

    public addAccountsToPartner(model: PartnerAccountsModel): Observable<PartnerOutputModel> {
        return this.httpClient.post<PartnerOutputModel>(`${APP_CONFIG.baseUrl}${addAccountsToPartnerApiUrl}`, model, {
            headers: this.getHttpHeaders(false)
        });
    }

    public addTransfer(transferModel: TransferModel): Observable<AddedTransferOutputModel> {
        return this.httpClient.post<AddedTransferOutputModel>(
            `${APP_CONFIG.baseUrl}${addTransferApiUrl}`,
            transferModel
        );
    }

    public cancelTransfer(model: TransactionInfoModel): Observable<void> {
        return this.httpClient.post<void>(`${APP_CONFIG.baseUrl}${cancelTransferApiUrl}`, model);
    }

    public confirmTransfer(model: TransactionInfoModel): Observable<ConfirmedTransferOutputModel> {
        return this.httpClient.post<ConfirmedTransferOutputModel>(
            `${APP_CONFIG.baseUrl}${confirmTransferApiUrl}`,
            model
        );
    }

    public addPayment(paymentModel: PaymentModel): Observable<AddedPaymentOutputModel> {
        return this.httpClient.post<AddedPaymentOutputModel>(`${APP_CONFIG.baseUrl}${addPaymentApiUrl}`, paymentModel);
    }

    public cancelPayment(model: TransactionInfoModel): Observable<void> {
        return this.httpClient.post<void>(`${APP_CONFIG.baseUrl}${cancelPaymentApiUrl}`, model);
    }

    public confirmPayment(model: TransactionInfoModel): Observable<ConfirmedPaymentOutputModel> {
        return this.httpClient.post<ConfirmedPaymentOutputModel>(`${APP_CONFIG.baseUrl}${confirmPaymentApiUrl}`, model);
    }

    private getHttpHeaders(hideProgress?: boolean): HttpHeaders {
        let httpHeaders = new HttpHeaders();
        if (hideProgress === true) {
            httpHeaders = httpHeaders.set('X-BackgroundRequest', '');
        }
        return httpHeaders;
    }
}
