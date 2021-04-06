import { BiometricIDAvailableResult, FingerprintAuthApi, VerifyFingerprintOptions } from "./fingerprint-auth.common";
export declare class FingerprintAuth implements FingerprintAuthApi {
    private readonly biometricManager;
    private biometricPrompt;
    constructor();
    available(): Promise<BiometricIDAvailableResult>;
    didFingerprintDatabaseChange(): Promise<boolean>;
    verifyFingerprint(options: VerifyFingerprintOptions): Promise<void | string>;
    close(): void;
    private tryGetCryptoObject;
    private getActivity;
    private static createKey;
}
