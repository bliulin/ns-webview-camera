import { Card, CardDetailsOutputModel } from './api';

export type CardProcessorType = 'Visa' | 'MasterCard';

export interface CardVisual {
    bgColor: string;
    processor: CardProcessorType;
    pan: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    expiryDate?: string;
}

export class CardVisualMapper {
    public static create(card: Card, details: CardDetailsOutputModel): CardVisual {
        const [month, year] = details.expiryDate.split('/');
        return {
            pan: details.pan.replace(/-/g, ''),
            expiryMonth: month,
            expiryYear: year,
            cvv: details.cvv2,
            bgColor: card.ui.bgColor,
            processor: <CardProcessorType>card.processor
        };
    }

    public static createObscure(card: Card): CardVisual {
        const last4Digits = card.ui.last4Digits || '';
        const pan = '*'.repeat(16 - last4Digits.length) + last4Digits;
        return {
            pan,
            expiryMonth: '**',
            expiryYear: '**',
            cvv: '***',
            bgColor: card.ui.bgColor,
            processor: <CardProcessorType>card.processor
        };
    }
}
