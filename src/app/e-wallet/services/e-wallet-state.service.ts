import { Injectable } from '@angular/core';
import { EWalletApiService } from './e-wallet-api.service';
import { CachedObservable } from '~/app/core/services/cached-observable';
import { CardOutputModel } from '../models/api/cardOutputModel';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';
import { Card, CardLimitOutputModel, EligibleCard } from '../models/api';
import * as appSettings from 'tns-core-modules/application-settings';
import { EWallet } from '~/app/shared/constants';
import { CardViewModel } from '~/app/e-wallet/models/card-view-model';

@Injectable({
    providedIn: 'root'
})
export class EWalletStateService {
    private _eWalletVM$: CachedObservable<CardOutputModel>;

    private _cards$: Observable<Card[]>;
    private _currentCard$: Observable<CardViewModel>;
    private _eligibleCards$: Observable<EligibleCard[]>;

    private _currentCardLimits$: CachedObservable<CardLimitOutputModel[]>;
    private _selectedCardLimit$: Observable<CardLimitOutputModel>;
    private _selectedEligibleCardForCardCreation: Observable<EligibleCard>;

    private currentCardSubject: BehaviorSubject<string> = new BehaviorSubject(null);

    public selectedLimitSubject: BehaviorSubject<string> = new BehaviorSubject(null);

    public selectedEligibleCardSubject: BehaviorSubject<string> = new BehaviorSubject(null);

    constructor(private apiService: EWalletApiService) {
        this.initObservables();
    }

    public get eWalletVm$(): Observable<CardOutputModel> {
        return this._eWalletVM$;
    }

    public get cards$(): Observable<Card[]> {
        return this._cards$;
    }

    public get currentSelectedCard$(): Observable<CardViewModel> {
        return this._currentCard$;
    }

    public get eligibleCards$(): Observable<EligibleCard[]> {
        return this._eligibleCards$;
    }

    public get selectedEligibleCardForCardCreation$(): Observable<EligibleCard> {
        return this._selectedEligibleCardForCardCreation;
    }

    public get currentCardLimits$(): Observable<CardLimitOutputModel[]> {
        return this._currentCardLimits$;
    }

    public get selectedCardLimit$(): Observable<CardLimitOutputModel> {
        return this._selectedCardLimit$;
    }

    public invalidateCache(): void {
        this._eWalletVM$.invalidate();
        this._currentCardLimits$.invalidate();
    }

    public invalidateCurrentCardLimits(): void {
        this._currentCardLimits$.invalidate();
    }

    public reload(): void {
        this._eWalletVM$.reload();
        this._currentCardLimits$.invalidate();
    }

    public selectCardWithId(id: string): void {
        appSettings.setString(EWallet.CurrentCardId, id);
        this.currentCardSubject.next(id);
    }

    public get selectedCardId(): string {
        return appSettings.getString(EWallet.CurrentCardId);
    }

    private initObservables(): void {
        const eWalletReq = this.apiService.get();
        this._eWalletVM$ = new CachedObservable(eWalletReq);

        this._cards$ = this.eWalletVm$.pipe(
            tap((ew) => this.handleCurrentCardSet(ew)),
            map((ew) => ew.cards)
        );

        this._eligibleCards$ = this.eWalletVm$.pipe(map((ew) => ew.eligibleCards));

        this._currentCard$ = combineLatest([this.cards$, this.currentCardSubject]).pipe(
            map(([cards, selectedCardId]) => cards.find((card) => card.cardId === selectedCardId)),
            filter((card) => Boolean(card)),
            map((card) => new CardViewModel(card))
        );

        const cardLimitsReq = this.apiService.getCardLimits(true);
        this._currentCardLimits$ = new CachedObservable(cardLimitsReq);

        this._selectedCardLimit$ = combineLatest([this._currentCardLimits$, this.selectedLimitSubject]).pipe(
            map(([limits, selectedLimitId]) => limits.find((limit) => limit.limitId === selectedLimitId))
        );

        this._selectedEligibleCardForCardCreation = combineLatest([
            this._eligibleCards$,
            this.selectedEligibleCardSubject
        ])
            .pipe(
                map(([eligibleCards, selectedEligibleCardId]) =>
                    eligibleCards.find((eligibleCard) => eligibleCard.productId === selectedEligibleCardId)
                )
            );
    }

    private handleCurrentCardSet(eWalletVm: CardOutputModel): void {
        const currentCardIdIsSet = appSettings.hasKey(EWallet.CurrentCardId);
        const currentCardId = appSettings.getString(EWallet.CurrentCardId);

        const currentCardIdIsStillValid = eWalletVm.cards.find((company) => company.cardId === currentCardId) || null;
        if (currentCardIdIsSet && currentCardIdIsStillValid) {
            this.currentCardSubject.next(currentCardId);
        } else {
            const issuedCards = eWalletVm.cards;
            this.selectCardWithId(issuedCards[0].cardId);
        }
    }
}
