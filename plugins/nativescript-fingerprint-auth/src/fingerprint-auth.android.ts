/* tslint:disable:typedef */
import * as app from "tns-core-modules/application";
import { ad as androidUtils } from "tns-core-modules/utils/utils";
import {
    BiometricIDAvailableResult,
    ERROR_CODES,
    FingerprintAuthApi,
    VerifyFingerprintOptions } from "./fingerprint-auth.common";
import Executors = java.util.concurrent.Executors;

class Consts {
    // androidx.biometric.BiometricManager
    public static readonly BIOMETRIC_ERROR_HW_UNAVAILABLE = 1;
    public static readonly BIOMETRIC_ERROR_NONE_ENROLLED = 11;
    public static readonly BIOMETRIC_ERROR_NO_HARDWARE = 12;
    public static readonly BIOMETRIC_SUCCESS = 0;

    // androidx.biometric.BiometricPrompt
    public static readonly ERROR_NEGATIVE_BUTTON = 13;
}

declare const androidx: any;
const KEY_NAME = "fingerprintauth";

class AuthenticationCallback extends androidx.biometric.BiometricPrompt.AuthenticationCallback {
    constructor(private resolve: any, private reject: any) {
        super();
    }
    public onAuthenticationSucceeded(param0: any): void {
        console.log('Authentication succeeded.');
        this.resolve();
    }
    public onAuthenticationFailed(): void {
        console.log(`Error: Fingerprint not recognized.`);
    }
    public onAuthenticationError(errCode: number, param1: string): void {
        console.log(`Error: ${errCode} ${param1}`);
        if (errCode === Consts.ERROR_NEGATIVE_BUTTON) {
            this.reject({
                code: ERROR_CODES.USER_CANCELLED,
                message: "User cancelled"
            });
        }
        this.reject({
            code: ERROR_CODES.RECOVERABLE_ERROR,
            message: param1
        });
    }
}

export class FingerprintAuth implements FingerprintAuthApi {

    private readonly biometricManager: any;
    private biometricPrompt: any;

    constructor() {
        this.biometricManager = androidx.biometric.BiometricManager.from(androidUtils.getApplicationContext());
    }

    public available(): Promise<BiometricIDAvailableResult> {
        return new Promise((resolve, reject) => {
            try {
                // The fingerprint API is only available from Android 6.0 (M, Api level 23)
                if (android.os.Build.VERSION.SDK_INT < 23) {
                    reject(`Your api version doesn't support fingerprint authentication`);
                    return;
                }

                if (!this.biometricManager) {
                    reject('Device does not support fingerprint authentication');
                }

                const result = this.biometricManager.canAuthenticate();

                if (result === Consts.BIOMETRIC_ERROR_HW_UNAVAILABLE
                    || result === Consts.BIOMETRIC_ERROR_NO_HARDWARE) {
                    reject(`Device doesn't support fingerprint authentication`);
                } else if (result === Consts.BIOMETRIC_ERROR_NONE_ENROLLED) {
                    reject(`User hasn't enrolled any fingerprints to authenticate with`);
                } else {
                    resolve({any: true, touch: true});
                }
            } catch (ex) {
                console.log(`fingerprint-auth.available: ${ex}`);
                reject(ex);
            }
        });
    }

    public didFingerprintDatabaseChange(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            // not implemented for Android
            // TODO should be possible..
            resolve(false);
        });
    }

    public verifyFingerprint(
        options: VerifyFingerprintOptions
    ): Promise<void | string> {
        return new Promise((resolve, reject) => {

            try {
                FingerprintAuth.createKey();
                const executor = Executors.newSingleThreadExecutor();
                this.biometricPrompt = new androidx.biometric.BiometricPrompt(
                    this.getActivity(),
                    executor,
                    new AuthenticationCallback(resolve, reject)
                );

                const promptInfo = new androidx.biometric.BiometricPrompt.PromptInfo.Builder()
                    .setTitle(options.title)
                    .setSubtitle(options.subtitle)
                    .setDescription(options.message)
                    .setNegativeButtonText(options.negativeButtonText)
                    .build();

                const crypto = this.tryGetCryptoObject();

                this.biometricPrompt.authenticate(promptInfo, crypto);
            } catch (err) {
                reject({
                    code: ERROR_CODES.UNEXPECTED_ERROR,
                    message: err.message | err
                });
            }
        });
    }

    public close(): void {
        if (this.biometricPrompt) {
            this.biometricPrompt.cancelAuthentication();
        }
    }

    private tryGetCryptoObject(): any {
        const keyStore = java.security.KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);
        const secretKey = keyStore.getKey(KEY_NAME, null);

        const cipher = javax.crypto.Cipher.getInstance(
            `${android.security.keystore.KeyProperties.KEY_ALGORITHM_AES}/${android.security.keystore.KeyProperties.BLOCK_MODE_CBC}/${android.security.keystore.KeyProperties.ENCRYPTION_PADDING_PKCS7}`
        );

        cipher.init(javax.crypto.Cipher.ENCRYPT_MODE, secretKey);

        return new androidx.biometric.BiometricPrompt.CryptoObject(
            cipher
        );
    }

    private getActivity(): any /* android.app.Activity */ {
        return app.android.foregroundActivity || app.android.startActivity;
    }

     /**
     * Creates a symmetric key in the Android Key Store which can only be used after the user has
     * authenticated with device credentials within the last X seconds.
     */
    private static createKey(): void {
        try {
            const keyStore = java.security.KeyStore.getInstance(
                "AndroidKeyStore"
            );
            keyStore.load(null);
            const keyGenerator = javax.crypto.KeyGenerator.getInstance(
                android.security.keystore.KeyProperties.KEY_ALGORITHM_AES,
                "AndroidKeyStore"
            );

            keyGenerator.init(
                new android.security.keystore.KeyGenParameterSpec.Builder(
                    KEY_NAME,
                    android.security.keystore.KeyProperties.PURPOSE_ENCRYPT |
                        android.security.keystore.KeyProperties.PURPOSE_DECRYPT
                )
                    .setBlockModes([
                        android.security.keystore.KeyProperties.BLOCK_MODE_CBC
                    ])
                    .setUserAuthenticationRequired(true)
                    .setEncryptionPaddings([
                        android.security.keystore.KeyProperties
                            .ENCRYPTION_PADDING_PKCS7
                    ])
                    .build()
            );
            keyGenerator.generateKey();
        } catch (error) {
            // checks if the AES algorithm is implemented by the AndroidKeyStore
            if (
                `${error.nativeException}`.indexOf(
                    "java.security.NoSuchAlgorithmException:"
                ) > -1
            ) {
                // You need a device with API level >= 23 in order to detect if the user has already been authenticated in the last x seconds.
            }
        }
    }

}
