import { Injectable } from "@angular/core";
import { CurrencyPipe } from "@angular/common";

const currencyDigitsInfo = "1.2-2";

@Injectable()
export class LocaleService {
    private _currentLocale: string = "en-US";

    constructor(private currencyPipe: CurrencyPipe) {}

    public formatAsCurrency(amount: number): string {
        return this.currencyPipe.transform(
            amount,
            null,
            "",
            currencyDigitsInfo,
            this.currentLocale
        );
    }

    public set currentLocale(locale: string) {
        this._currentLocale = locale;
    }

    public get currentLocale(): string {
        return this._currentLocale;
    }
}
