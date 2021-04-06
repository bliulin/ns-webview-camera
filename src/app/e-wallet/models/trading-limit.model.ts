export type TradingLimitIcon = 'coins' | 'shield';

export interface TradingLimitModel {
    id: string;
    icon: TradingLimitIcon;
    name: string;
    currentAmount: number;
}