import { Injectable } from '@angular/core';
import * as appSettings from 'tns-core-modules/application-settings';

@Injectable({
    providedIn: 'root'
})
export class AppSettingsService {
    constructor() {}

    public set(key: string, value: any): void {
        if (value === null) {
            appSettings.remove(key);
            return;
        }
        switch (typeof value) {
            case 'string':
                appSettings.setString(key, <string>value);
                break;
            case 'number':
                appSettings.setNumber(key, <number>value);
                break;
            case 'boolean':
                appSettings.setBoolean(key, <boolean>value);
                break;  
            default:
                throw Error('value type should be string, number or boolean!');
        }
    }

    public getString(key: string): string {
        return appSettings.getString(key);
    }

    public getNumber(key: string): number {
        return appSettings.getNumber(key);
    }

    public getBoolean(key: string): boolean {
        return appSettings.getBoolean(key);
    }

    public remove(key: string): void {
        appSettings.remove(key);
    }

    public clear(): void {
        appSettings.clear();
    }
}
