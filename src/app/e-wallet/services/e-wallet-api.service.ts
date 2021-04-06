import { Injectable } from '@angular/core';
import { APP_CONFIG } from '~/app/core/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as appSettings from 'tns-core-modules/application-settings';
import {
    CardDetailsOutputModel,
    CardLimitOutputModel,
    CardPinOutputModel,
    CardCreateOutputModel,
    PhysicalCardCreateModel,
    VirtualCardCreateModel,
    CardBlockModel,
    CardPinModel
} from '../models/api';
import { EWallet } from '~/app/shared/constants';

const getCardsApiUrl = 'Private/cards';
const getCardsLimitsApiUrl = 'Private/cardlimits';
const updateCardTradingLimitApiUrl = 'Private/card/limit';
const getCardDetailsUrl = 'Private/carddetails';
const getCardPinUrl = 'Private/cardpin';
const createPhysicalCardApiUrl = 'Private/card/physical';
const createVirtualCardApiUrl = 'Private/card/virtual';
const blockCardApiUrl = 'Private/card/block';
const activateCardApiUrl = 'Private/card/activate';
const changeCardPinApiUrl = 'Private/card/pin';
@Injectable({
    providedIn: 'root'
})
export class EWalletApiService {
    constructor(private httpClient: HttpClient) {}

    public get(hideProgress?: boolean): Observable<any> {
        return this.httpClient.get<any>(`${APP_CONFIG.baseUrl}${getCardsApiUrl}`, {
            headers: this.getHttpHeaders(hideProgress)
        });
    }

    public getCardLimits(hideProgress?: boolean): Observable<CardLimitOutputModel[]> {
        return this.httpClient.get<CardLimitOutputModel[]>(`${APP_CONFIG.baseUrl}${getCardsLimitsApiUrl}?cardId=${this.selectedCardId}`, {
            headers: this.getHttpHeaders(hideProgress)
        });
    }

    public updateCardTradingLimit(updateModel: {
        limitId: string;
        newAmount: number;
    }): Observable<CardLimitOutputModel> {
        return this.httpClient.post<CardLimitOutputModel>(
            `${APP_CONFIG.baseUrl}${updateCardTradingLimitApiUrl}`,
            updateModel
        );
    }

    public getCardDetails(cardId: string): Observable<CardDetailsOutputModel> {
        return this.httpClient.get<CardDetailsOutputModel>(
            `${APP_CONFIG.baseUrl}${getCardDetailsUrl}?cardId=${cardId}`,
            {
                headers: this.getHttpHeaders()
            }
        );
    }

    public getCardPin(cardId: string): Observable<CardPinOutputModel> {
        return this.httpClient.get<CardPinOutputModel>(`${APP_CONFIG.baseUrl}${getCardPinUrl}?cardId=${cardId}`, {
            headers: this.getHttpHeaders(true)
        });
    }

    public createPhysicalCard(createModel: PhysicalCardCreateModel): Observable<CardCreateOutputModel> {
        return this.httpClient.post<CardCreateOutputModel>(
            `${APP_CONFIG.baseUrl}${createPhysicalCardApiUrl}`,
            createModel
        );
    }
    public createVirtualCard(createModel: VirtualCardCreateModel): Observable<VirtualCardCreateModel> {
        return this.httpClient.post<VirtualCardCreateModel>(
            `${APP_CONFIG.baseUrl}${createVirtualCardApiUrl}`,
            createModel
        );
    }

    public blockCard(blockModel: CardBlockModel): Observable<void> {
        return this.httpClient.post<void>(`${APP_CONFIG.baseUrl}${blockCardApiUrl}`, blockModel);
    }

    public activateCard(cardId: string): Observable<void> {
        return this.httpClient.post<void>(`${APP_CONFIG.baseUrl}${activateCardApiUrl}`, { cardId: cardId });
    }

    public changeCardPin(cardPinUpdateModel: CardPinModel): Observable<void> {
        return this.httpClient.post<void>(`${APP_CONFIG.baseUrl}${changeCardPinApiUrl}`, cardPinUpdateModel);
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
