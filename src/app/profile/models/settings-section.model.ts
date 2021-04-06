export enum SettingAction {
    Notifications = 0,
    SetLanguage = 1,
    ChangePIN = 2,
    Biometrics = 3,
    ResetPassword = 4,
    LogOut = 5
}

export class SettingsSection {
    public name: string;
    public description?: string;
    public iconCode: string;
    public action: SettingAction;
    public isAvaible: boolean;

    constructor(name: string, ic: string, settingAction: SettingAction, desc?: string, avaible?: boolean) {
        this.name = name;
        this.iconCode = ic;
        this.action = settingAction;
        this.description = desc;
        this.isAvaible = avaible;
    }
}
