import { Injectable } from "@angular/core";
import { SecureStorage } from "nativescript-secure-storage";

@Injectable()
export class KeystoreService {
    private secureStorage: SecureStorage;

    constructor() {
        this.secureStorage = new SecureStorage();
    }

    public set(key: string, value: string): Promise<boolean> {
        return this.secureStorage.set({
            key: key,
            value: value
        });
    }

    public get(key: string): Promise<string> {
        return this.secureStorage.get({
            key: key
        });
    }

    public getSync(key: string): string {
        return this.secureStorage.getSync({
            key: key
        });        
    }

    public removeAll(): Promise<boolean> {
        return this.secureStorage.removeAll();
    }

    public remove(key: string): Promise<boolean> {
        return this.secureStorage.remove({ key: key });
    }
}
