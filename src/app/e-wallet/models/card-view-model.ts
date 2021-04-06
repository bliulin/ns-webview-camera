import { Card, CardState, CardType, Limit, UIInfo } from '~/app/e-wallet/models/api';
import { CardVisual, CardVisualMapper } from './card-visual';

export interface CardUIState {
    canTop: boolean;
    canShowDetails: boolean;
    showConfigSection: boolean;
    showLimits: boolean;
    canChangePIN: boolean;
    canBlockCard: boolean;
    canActivateCard: boolean;
    canChangeSettings: boolean;
}

export class CardViewModel implements Card {
    constructor(card: Card) {
        Object.assign(this, card);
        this.uiState = this.getUiState();
        this.cardVisual = this.getCardVisual();
    }
    readonly cardId?: string;
    readonly name?: string;
    readonly cardType?: CardType;
    readonly cardState?: CardState;
    readonly readOnly: boolean;
    readonly stateName?: string;
    readonly processor?: string;
    readonly balance?: number;
    readonly currencyCode?: string;
    readonly currecyDisplayName?: string;
    readonly ui?: UIInfo;
    readonly limits?: Limit[];
    readonly uiState: CardUIState;
    readonly cardVisual: CardVisual;

    private getCardVisual(): CardVisual {
        return CardVisualMapper.createObscure(this);
    }

    private getUiState(): CardUIState {
        const stateIn = (...states: CardState[]) => states.indexOf(this.cardState) >= 0;
        const stateNotIn = (...states: CardState[]) => states.indexOf(this.cardState) < 0;
        return {
            canTop: stateIn('Active'),
            canShowDetails: !this.readOnly && stateNotIn('Lost', 'DoNotHonor'),
            showConfigSection: stateNotIn('PendingIssuing', 'Destroyed', 'Stolen'),
            showLimits: stateIn('Active'),
            canChangeSettings: stateIn('Active'),
            canChangePIN: !this.readOnly && this.cardType === 'Physical' && stateNotIn('Lost', 'DoNotHonor'),
            canActivateCard: stateIn('Lost', 'DoNotHonor'),
            canBlockCard: stateIn('Active'),
        };
    }
}
