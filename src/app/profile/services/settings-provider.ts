import { SettingsSection, SettingAction } from '../models/settings-section.model';
import { BiometricIDAvailableResult } from 'nativescript-fingerprint-auth';
import { localize } from 'nativescript-localize/localize';

export class SettingsProvider {
    public static getSettings(biometrics: BiometricIDAvailableResult): SettingsSection[] {
        return new Array<SettingsSection>(
            new SettingsSection(
                localize('Profile.Settings.Actions.Notifications.Title'),
                String.fromCharCode(0x0046),
                SettingAction.Notifications,
                localize('Profile.Settings.Actions.Notifications.Description'),
                false
            ),
            new SettingsSection(
                localize('Profile.Settings.Actions.SetLanguage.Title'),
                String.fromCharCode(0x004e),
                SettingAction.SetLanguage,
                'Română', // [no need to be localized] here will be a service call maybe to get the current app's language
                false
            ),
            new SettingsSection(
                localize('Profile.Settings.Actions.ChangePin.Title'),
                String.fromCharCode(0x0045),
                SettingAction.ChangePIN,
                '',
                true
            ),
            new SettingsSection(
                localize('Profile.Settings.Actions.Biometrics.Title'),
                String.fromCharCode(0xf577),
                SettingAction.Biometrics,
                'biometrics',
                biometrics.any
            ),
            new SettingsSection(
                localize('Profile.Settings.Actions.ResetPasword.Title'),
                String.fromCharCode(0x0044),
                SettingAction.ResetPassword,
                '',
                true
            ),
            new SettingsSection(
                localize('Profile.Settings.Actions.LogOut.Title'),
                String.fromCharCode(0x0043),
                SettingAction.LogOut,
                '',
                true
            )
        );
    }
}