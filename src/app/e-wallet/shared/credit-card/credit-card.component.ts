import { Component, Input, OnInit } from '@angular/core';
import { AppColors } from '~/app/shared/constants';
import { CardVisual } from '../../models/card-visual';

@Component({
    selector: 'omro-credit-card',
    templateUrl: './credit-card.component.html',
    styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent {
    public appColors: typeof AppColors = AppColors;
    @Input() public model: CardVisual;

    public getDigitGroup(group: number): string {
        return this.model.pan.substring(group * 4, (group + 1) * 4);
    }
}
