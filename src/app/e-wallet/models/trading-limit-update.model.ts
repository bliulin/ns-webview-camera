export interface TradingLimitUpdateModel {
    cardName: string;
    last4Digits: string;
    limitName: string;
    currentLimit: number;
    maximumLimit: number;
    currencyDisplayName: string;
}