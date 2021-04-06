export interface LoanDetails {
    //purpose: string;
    totalAmount: number;
    currencyDisplayName: string;
    totalLeftAmount: number;
    interestRate: number;
    months: number;
    nextDueDate: Date;
    isCompletelyPaid: boolean;
    IBAN: string;
    bank: string;
}