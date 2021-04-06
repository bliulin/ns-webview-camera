import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: 'roundOneThousand'})
export class RoundOneThousandPipe implements PipeTransform {
  public transform(value: number): number {
    return Math.round(value / 1000);
  }
}