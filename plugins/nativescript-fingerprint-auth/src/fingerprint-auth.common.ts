export enum ERROR_CODES {
    PASSWORD_FALLBACK_SELECTED = -3, // historically this is what iOS uses, so using that as well
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
    /**
     * The optional title in the fingerprint page for android.
     * Default: whatever the device default is ('Confirm your password' is likely)
     */
    title?: string;

    /**
     * The optional message in the fingerprint dialog on ios and page description on android.
     * Default: 'Scan your finger' on iOS and the device default on Android (which is likely 'Enter your device password to continue').
     */
    message?: string;

    /**
     * Android only.
     */
    subtitle?: string;

    /**
     * Android only.
     */
    negativeButtonText?: string;
}

export interface BiometricIDAvailableResult {
    any: boolean;
    touch?: boolean;
    face?: boolean;
}

//noinspection JSUnusedGlobalSymbols
export interface FingerprintAuthApi {
    available(): Promise<BiometricIDAvailableResult>;

    didFingerprintDatabaseChange(): Promise<boolean>;

    verifyFingerprint(options: VerifyFingerprintOptions): Promise<void | string>;

    close(): void;
}
