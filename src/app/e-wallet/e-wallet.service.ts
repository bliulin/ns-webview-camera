import { Injectable, ViewContainerRef } from '@angular/core';
import { EligibleCard, CardType, CardOutputModel } from './models/api';
import { BottomDialogButton, BottomDialogButtonType, Orientation } from '../shared/models/bottom-dialog.config';
import localize from 'nativescript-localize';
import { EWalletStateService } from './services/e-wallet-state.service';
import { OmroModalService } from '../shared/services/omro-modal.service';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { CardSelectionModel } from './models';
import { BottomSheetOptions } from 'nativescript-material-bottomsheet/angular';
import { SwitchCurrentCardComponent } from './components';

export interface EWalletUiState {
    notAvaible: boolean;
    onlyEligibleCards: boolean;
    onlyIssuedCards: boolean;
    bothAvailable: boolean;
}

@Injectable()
export class EWalletService {
    constructor(private stateService: EWalletStateService, private omroModalService: OmroModalService) {}

    public getState(cardsReq: CardOutputModel): EWalletUiState {
        const hasAtLeastOneIssuedCard = !!cardsReq.cards.length;
        const hasAtLeastOneAvaibleEligibleCard = !!cardsReq.eligibleCards.length;

        return <EWalletUiState>{
            notAvaible: !hasAtLeastOneIssuedCard && !hasAtLeastOneAvaibleEligibleCard,
            onlyEligibleCards: hasAtLeastOneAvaibleEligibleCard && !hasAtLeastOneIssuedCard,
            onlyIssuedCards: hasAtLeastOneIssuedCard && !hasAtLeastOneAvaibleEligibleCard,
            bothAvailable: hasAtLeastOneIssuedCard && hasAtLeastOneAvaibleEligibleCard
        };
    }

    public showCardSelectionModal(eligibleCards: EligibleCard[], containerRef: ViewContainerRef): Observable<any> {
        const bottomSheetDialogActions = eligibleCards.map(
            (eligibleCard) =>
                <BottomDialogButton<any>>{
                    buttonType: BottomDialogButtonType.Secondary,
                    text: eligibleCard.name,
                    result: {
                        result: CardType[eligibleCard.cardType],
                        resultId: eligibleCard.productId
                    }
                }
        );
        return this.omroModalService.showBottomDialog({
            viewContainerRef: containerRef,
            title: localize('EWallet.Homepage.NoCardsAdded.ModalTitle'),
            orientation: Orientation.Vertical,
            actions: bottomSheetDialogActions
        });
    }

    public getCardsMappedToCardSelectionModel$(): Observable<any> {
        return combineLatest([this.stateService.cards$, this.stateService.currentSelectedCard$]).pipe(
            map(([cards, currentSelectedCard]) =>
                cards.map(
                    (card) =>
                        ({
                            id: card.cardId,
                            name: card.name,
                            bgColor: card.ui.bgColor,
                            processor: card.processor,
                            isSelected: card.cardId === currentSelectedCard.cardId
                        } as CardSelectionModel)
                )
            )
        );
    }

    public showSwitchCardBottomSheet(containerRef: ViewContainerRef): void {
        const options: BottomSheetOptions = {
            viewContainerRef: containerRef,
            context: this.getCardsMappedToCardSelectionModel$(),
            transparent: true
        };

        this.omroModalService.showBottomSheet(SwitchCurrentCardComponent, options);
    }
}
