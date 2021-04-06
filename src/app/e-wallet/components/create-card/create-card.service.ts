import { Injectable } from '@angular/core';
import { Address, CardCreateOutputModel, VirtualCardCreateModel, CardType, EligibleCard } from '../../models/api';
import { EWalletStateService } from '../../services/e-wallet-state.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CreatePhysicalCardModel } from '../../models';
import { EWalletApiService } from '../../services/e-wallet-api.service';

@Injectable()
export class CreateCardService {
    private productId: string;
    private cardType: CardType;
    private _successMessage: string;

    private _cardCreateModel: CreatePhysicalCardModel = { accountId: null, pin: '', adress: null, name: '' };

    constructor(private stateService: EWalletStateService, private apiService: EWalletApiService) {}
    public adressVM$: Observable<Address> = this.stateService.eWalletVm$.pipe(map((ew) => ew.lastAddress));
    public eligibleCardVM$: Observable<EligibleCard> = this.stateService.selectedEligibleCardForCardCreation$.pipe(
        tap((data) => {
            this.productId = data.productId;
            this.cardType = data.cardType;
            this._successMessage = data.successMessage;
        })
    );

    public get cardCreateModel(): CreatePhysicalCardModel {
        return this._cardCreateModel;
    }

    public get successMessage(): string {
        return this._successMessage;
    }

    public get accountId(): string {
        return this._cardCreateModel.accountId;
    }

    public setAccountId(accountId: string): void {
        this._cardCreateModel.accountId = accountId;
    }

    public setPin(pin: string): void {
        this._cardCreateModel.pin = pin;
    }

    public setAdress(adress: Address): void {
        this._cardCreateModel.adress = adress;
    }

    public setCardName(name: string): void {
        this._cardCreateModel.name = name;
    }

    public createCard(): Observable<CardCreateOutputModel | VirtualCardCreateModel> {
        return this.cardType === CardType.Physical ? this.createPhysicalCard() : this.createVirtualCard();
    }

    private createPhysicalCard(): Observable<CardCreateOutputModel> {
        return this.apiService.createPhysicalCard({
            accountId: this.accountId,
            productId: this.productId,
            pin: this.cardCreateModel.pin,
            name: this.cardCreateModel.name,
            ...this.cardCreateModel.adress
        });
    }

    private createVirtualCard(): Observable<VirtualCardCreateModel> {
        return this.apiService.createVirtualCard({
            accountId: this.accountId,
            productId: this.productId,
            cardName: this.cardCreateModel.name
        });
    }
}
