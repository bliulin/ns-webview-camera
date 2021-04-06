import { Component, OnInit } from '@angular/core';
import { BottomSheetParams } from 'nativescript-material-bottomsheet/angular';
import { TradingLimitModel, TradingLimitIcon } from '../../models/trading-limit.model';
import { Observable } from 'rxjs';
import { RouterExtensions } from 'nativescript-angular';
import { BaseComponent } from '~/app/shared/base.component';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';

const creditCardIconSvgLocation = '~/app/images/credit-card.svg';
const euroIconSvgLocation = '~/app/images/euro.svg';

@Component({
    selector: 'omro-trading-limits-selection',
    templateUrl: './trading-limits-selection.component.html',
    styleUrls: ['./trading-limits-selection.component.scss']
})
export class TradingLimitsSelectionComponent extends BaseComponent {
    public tradingLimits: Observable<TradingLimitModel>;

    constructor(
        routerExtensions: RouterExtensions,
        private params: BottomSheetParams,
        private omroModalService: OmroModalService
    ) {
        super(routerExtensions);
        this.tradingLimits = this.params.context;
        this.omroModalService.registerModalCallback(params.closeCallback);
    }

    public onModifyButtonTap(tradingLimitId: string): void {
        this.closeAndEmitSelection(tradingLimitId);
    }

    public getIconLocation(iconHint: TradingLimitIcon): string {
        return iconHint === 'shield' ? creditCardIconSvgLocation : euroIconSvgLocation;
    }

    private closeAndEmitSelection(id: string): void {
        this.params.closeCallback(id);
    }
}
