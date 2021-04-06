export declare enum ERROR_CODES {
    PASSWORD_FALLBACK_SELECTED = -3,
    DEVELOPER_ERROR = 10,
    NOT_AVAILABLE = 20,
    NOT_CONFIGURED = 30,
    NOT_RECOGNIZED = 40,
    RECOVERABLE_ERROR = 50,
    USER_CANCELLED = 60,
    UNEXPECTED_ERROR = 70,
    TOO_MANY_ATTEMPTS = 80
}
export interface VerifyFingerprintOptions {
    title?: string;
    message?: string;
    subtitle?: string;
    negativeButtonText?: string;
}
export interface BiometricIDAvailableResult {
    any: boolean;
    touch?: boolean;
    face?: boolean;
}
export interface FingerprintAuthApi {
    available(): Promise<BiometricIDAvailableResult>;
    didFingerprintDatabaseChange(): Promise<boolean>;
    verifyFingerprint(options: VerifyFingerprintOptions): Promise<void | string>;
    close(): void;
}
