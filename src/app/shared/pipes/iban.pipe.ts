import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'iban'
})
export class IbanPipe implements  PipeTransform {
    public transform(value: string, ...args: any[]): string {
        let trimmed = value.trim();
        while (trimmed.indexOf(' ') >= 0) {
            trimmed = trimmed.replace(" ", "");
        }
        let result = '';
        let index = 4;
        for (; index < trimmed.length; index += 4) {
            result += trimmed.substr(index - 4, 4) + ' ';
        }
        result += trimmed.substr(index - 4, trimmed.length - index + 4);
        return result.trim();
    }
}
