import * as moment from 'moment';
import 'moment/locale/ro';

export function initLocale(locale: string): void {
    moment.locale(locale);
}

export function formatDate(date: Date, format?: string): string {
    if (format) {
        return moment(date).format(format);
    } else {
        return moment(date).format('Do MMMM YYYY');
    }
}
