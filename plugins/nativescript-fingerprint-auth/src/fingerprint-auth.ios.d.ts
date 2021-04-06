import { BiometricIDAvailableResult, FingerprintAuthApi, VerifyFingerprintOptions } from "./fingerprint-auth.common";
export declare class FingerprintAuth implements FingerprintAuthApi {
    private laContext;
    available(): Promise<BiometricIDAvailableResult>;
    didFingerprintDatabaseChange(): Promise<boolean>;
    verifyFingerprint(options: VerifyFingerprintOptions, usePasscodeFallback?: boolean): Promise<void>;
    close(): void;
}
