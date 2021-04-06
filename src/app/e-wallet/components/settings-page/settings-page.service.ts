import { Injectable } from '@angular/core';
import { EWalletStateService } from '../../services/e-wallet-state.service';
import { Observable, combineLatest } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SettingsPageModel } from '../../models';
import { EWalletSettingsApiService } from '../../services/e-wallet-settings-api.service';
import { CardSettingOutputModel, CardSettingModel } from '../../models/api';

@Injectable()
export class SettingsPageService {
    constructor(private stateService: EWalletStateService, private settingsApiService: EWalletSettingsApiService) {}
    public settingsPageVM$: Observable<SettingsPageModel> = combineLatest([
        this.stateService.currentSelectedCard$,
        this.settingsApiService.getCardSettings().pipe(take(1))
    ]).pipe(
        map(
            ([selectedCard, settigs]) =>
                <SettingsPageModel>{
                    cardName: selectedCard.name,
                    last4Digits: selectedCard.ui.last4Digits,
                    settings: settigs
                }
        )
    );

    public updateCardSetting(updateCardModelSetting: CardSettingModel): Observable<CardSettingOutputModel> {
        return this.settingsApiService.updateCardSetting(updateCardModelSetting);
    }
}
