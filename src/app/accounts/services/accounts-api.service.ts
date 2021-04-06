import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '~/app/core/environment';
import { AccountsOutputModel, BalanceSheetModel } from '../models/api';
import { AccountDetailsOutputModel } from '~/app/accounts/models/api/accountDetailsOutputModel';
import { AccountModel } from '~/app/accounts/models/api/accountModel';

const getAccountsApiUrl = 'Private/accounts';
const postAccountsApiUrl = 'Private/account';
const getAccountApiUrl = 'Private/account';
const accountStatementApiUrl = 'Private/account/ballancesheet';

@Injectable({
    providedIn: 'root'
})
export class AccountsApiService {
    constructor(private httpClient: HttpClient) {}

    public get(hideProgress?: boolean): Observable<AccountsOutputModel> {
        return this.httpClient.get<AccountsOutputModel>(`${APP_CONFIG.baseUrl}${getAccountsApiUrl}`, {
            headers: this.getHttpHeaders(hideProgress)
        });
    }

    public getAccountDetails(accountId: string): Observable<AccountDetailsOutputModel> {
        return this.httpClient.get<AccountDetailsOutputModel>(
            `${APP_CONFIG.baseUrl}${getAccountApiUrl}?accountId=${accountId}`,
            { headers: this.getHttpHeaders(true) }
        );
    }

    public createAccount(account: AccountModel): Observable<AccountDetailsOutputModel> {
        return this.httpClient.post<AccountDetailsOutputModel>(`${APP_CONFIG.baseUrl}${postAccountsApiUrl}`, account);
    }

    public getStatement(ballanceSheetModel: BalanceSheetModel): Observable<void> {
        return this.httpClient.post<void>(`${APP_CONFIG.baseUrl}${accountStatementApiUrl}`, ballanceSheetModel);
    }

    private getHttpHeaders(hideProgress?: boolean): HttpHeaders {
        let httpHeaders = new HttpHeaders();
        if (hideProgress === true) {
            httpHeaders = httpHeaders.set('X-BackgroundRequest', '');
        }
        return httpHeaders;
    }    
}
