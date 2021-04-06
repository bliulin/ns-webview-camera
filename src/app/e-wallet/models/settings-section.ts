export enum SettingAction {
    TransactionLimit,
    Settings,
    ChangePin,
    ActivateCard,
    BlockCard
}

export enum SettingStyle {
    Primary = 'Primary',
    Error = 'Error'
}

export interface SettingsSection {
    name: string;
    description?: string;
    iconCode: string;
    action: SettingAction;
    style?: SettingStyle;
    hidden?: boolean;
}
