import { Component } from '@angular/core';
import { BottomSheetParams } from 'nativescript-material-bottomsheet/angular';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { CardSelectionModel } from '../../models';
import { Observable } from 'rxjs';
import { EWalletStateService } from '../../services/e-wallet-state.service';

@Component({
    selector: 'app-switch-current-card',
    templateUrl: './switch-current-card.component.html',
    styleUrls: ['./switch-current-card.component.scss']
})
export class SwitchCurrentCardComponent {
    public cards$: Observable<CardSelectionModel>;

    constructor(
        private params: BottomSheetParams,
        private stateService: EWalletStateService,
        omroModalService: OmroModalService
    ) {
        this.cards$ = this.params.context;
        omroModalService.registerModalCallback(params.closeCallback);
    }

    public switchCardAndCloseBottomSheet(cardId: string): void {
        this.switchCard(cardId);
        setTimeout(() => this.params.closeCallback(), 300);
    }

    private switchCard(cardId: string): void {
        this.stateService.selectCardWithId(cardId);
        this.stateService.invalidateCurrentCardLimits();
    }
}
