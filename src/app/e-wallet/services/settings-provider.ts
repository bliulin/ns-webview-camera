import { SettingAction, SettingsSection, SettingStyle } from '../models/settings-section';
import { localize } from 'nativescript-localize';
import { CardUIState } from '~/app/e-wallet/models/card-view-model';

export class SettingsProvider {
    public getSettings(cardUiState: CardUIState): SettingsSection[] {
        return this._getSettings(cardUiState).filter(s => !s.hidden);
    }

    private localize = title => localize(`EWallet.Configuration.${title}`);

    private _getSettings(state: CardUIState): SettingsSection[] {
        return [
            {
                name: this.localize('TransactionLimit.DisplayName'),
                action: SettingAction.TransactionLimit,
                iconCode: String.fromCharCode(0x0045),
                hidden: state.showLimits === false
            },
            {
                name: this.localize('Settings.DisplayName'),
                action: SettingAction.Settings,
                iconCode: String.fromCharCode(0x0045),
                hidden: state.canChangeSettings === false
            },
            {
                name: this.localize('ChangePin.DisplayName'),
                action: SettingAction.ChangePin,
                iconCode: String.fromCharCode(0x0045),
                hidden: state.canChangePIN === false
            },
            {
                name: this.localize('BlockCard.DisplayName'),
                action: SettingAction.BlockCard,
                iconCode: String.fromCharCode(0x0045),
                style: SettingStyle.Error,
                hidden: state.canBlockCard === false
            },
            {
                name: this.localize('ActivateCard'),
                action: SettingAction.ActivateCard,
                iconCode: String.fromCharCode(0x0045),
                style: SettingStyle.Primary,
                hidden: state.canActivateCard === false
            }
        ];
    }
}
