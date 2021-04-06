import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as appSettings from 'tns-core-modules/application-settings';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '~/app/core/environment';
import { CardSettingOutputModel, CardSettingModel } from '../models/api';
import { EWallet } from '~/app/shared/constants';

const getCardSettingsApiUrl = 'Private/cardsettings';
const updateCardSettingApiUrl = 'Private/card/setting';
@Injectable()
export class EWalletSettingsApiService {
    constructor(private httpClient: HttpClient) {}

    public getCardSettings(): Observable<any[]> {
        return this.httpClient.get<any[]>(
            `${APP_CONFIG.baseUrl}${getCardSettingsApiUrl}?cardId=${this.selectedCardId}`,
            {
                headers: this.getHttpHeaders(false)
            }
        );
    }

    public updateCardSetting(updateModel: CardSettingModel): Observable<CardSettingOutputModel> {
        console.log(JSON.stringify(<CardSettingModel>{
            cardId: this.selectedCardId,
            ...updateModel
        }));
        return this.httpClient.post<CardSettingOutputModel>(
            `${APP_CONFIG.baseUrl}${updateCardSettingApiUrl}`,
            <CardSettingModel>{
                cardId: this.selectedCardId,
                ...updateModel
            },
            {
                headers: this.getHttpHeaders(true)
            }
        );
    }

    private get selectedCardId(): string {
        return appSettings.getString(EWallet.CurrentCardId);
    }

    public getHttpHeaders(hideProgress?: boolean): HttpHeaders {
        let httpHeaders = new HttpHeaders();
        if (hideProgress === true) {
            httpHeaders = httpHeaders.set('X-BackgroundRequest', '');
        }
        return httpHeaders;
    }
}
