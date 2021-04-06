import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
    name: 'fraction'
})
export class FractionPipe implements PipeTransform {
    constructor(@Inject(LOCALE_ID) private locale: string) {
    }

    public transform(value: number, ...args: any[]): any {
        const fract = value - Math.trunc(value);
        return formatNumber(fract, this.locale, '0.2-2').substring(1);
    }
}
