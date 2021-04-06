import { CardSettingOutputModel } from "./api";

export interface SettingsPageModel {
    cardName: string;
    last4Digits: string;
    settings: CardSettingOutputModel[];
}