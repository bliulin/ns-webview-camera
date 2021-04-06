import { Injectable } from '@angular/core';
import { EWalletStateService } from '../../services/e-wallet-state.service';
import { combineLatest, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { TradingLimitUpdateModel } from '../../models';
import { EWalletApiService } from '../../services/e-wallet-api.service';
import { CardLimitOutputModel } from '../../models/api';

@Injectable()
export class TradingLimitDescriptionService {
    constructor(private stateService: EWalletStateService, private apiService: EWalletApiService) {}

    public tradingLimitUpdateVM$: Observable<TradingLimitUpdateModel> = combineLatest([
        this.stateService.currentSelectedCard$,
        this.stateService.selectedCardLimit$
    ]).pipe(
        filter(([currentCard]) => Boolean(currentCard)),
        map(
            ([currentCard, cardLimit]) =>
                <TradingLimitUpdateModel>{
                    cardName: currentCard.name,
                    last4Digits: currentCard.ui.last4Digits,
                    limitName: cardLimit.name,
                    currentLimit: cardLimit.currentAmount,
                    maximumLimit: cardLimit.maxLimit,
                    currencyDisplayName: cardLimit.currencyDisplayName
                }
        )
    );

    public changeCardTradingLimitSelection(tradingLimitId: string): void {
        this.stateService.selectedLimitSubject.next(tradingLimitId);
    }

    public updateTradingLimit(limitUpdateModel: {
        limitId: string;
        newAmount: number;
    }): Observable<CardLimitOutputModel> {
        return this.apiService.updateCardTradingLimit(limitUpdateModel);
    }

    public reloadEWalletVm(): void {
        this.stateService.reload();
    }
}
