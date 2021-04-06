import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'kebabcase'
})
export class KebabcasePipe implements PipeTransform {

    transform(value: string): any {
        if (!value) {
            return value;
        }
        return value
            .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
            .map(x => x.toLowerCase())
            .join('-');
    }

}
