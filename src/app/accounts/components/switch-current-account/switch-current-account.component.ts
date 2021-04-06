import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BottomSheetParams } from 'nativescript-material-bottomsheet/angular';
import { AccountsStateService } from '../../services/accounts-state.service';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { AccountSelectionModel } from '../../models';
import { Color } from 'tns-core-modules/color/color';
import { isValidColor } from '~/app/shared/utils/utils';
import { AppColors } from '~/app/shared/constants';

@Component({
    selector: 'app-switch-current-account',
    templateUrl: './switch-current-account.component.html',
    styleUrls: ['./switch-current-account.component.scss']
})
export class SwitchCurrentAccountComponent {
    public accounts$: Observable<AccountSelectionModel>;

    constructor(
        private params: BottomSheetParams,
        private stateService: AccountsStateService,
        omroModalService: OmroModalService
    ) {
        this.accounts$ = this.params.context;
        omroModalService.registerModalCallback(params.closeCallback);
    }

    public getBackgroundColor(color?: string): Color {
        let colorAsRgb: any;
        if (isValidColor(color)) {
            colorAsRgb = this.hexToRgb(color);
        } else {
            colorAsRgb = this.hexToRgb(AppColors.Green);
        }
        return new Color(50, colorAsRgb.r, colorAsRgb.g, colorAsRgb.b);
    }

    public switchCardAndCloseBottomSheet(cardId: string): void {
        this.switchCard(cardId);
        setTimeout(() => this.params.closeCallback(), 300);
    }

    private switchCard(cardId: string): void {
        this.stateService.selectAccountWithId(cardId);
        // this.stateService.invalidateCurrentCardLimits();
    }

    private hexToRgb(hex: string): any {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
              }
            : null;
    }
}
