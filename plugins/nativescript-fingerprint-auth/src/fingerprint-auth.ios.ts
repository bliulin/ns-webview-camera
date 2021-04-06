/* tslint:disable:variable-name */
import { ios as iOSUtils } from "tns-core-modules/utils/utils";
import {
  BiometricIDAvailableResult,
  FingerprintAuthApi,
  VerifyFingerprintOptions
} from "./fingerprint-auth.common";

export class FingerprintAuth implements FingerprintAuthApi {
  private laContext: LAContext;

  public available(): Promise<BiometricIDAvailableResult> {
    return new Promise((resolve, reject) => {
      try {
        const laContext = LAContext.new();
        const hasBio = laContext.canEvaluatePolicyError(LAPolicy.DeviceOwnerAuthenticationWithBiometrics);

        resolve({
          any: hasBio,
          touch: hasBio && laContext.biometryType === 1, // LABiometryType.TypeTouchID,
          face: hasBio && laContext.biometryType === 2 // LABiometryType.TypeFaceID,
        });
      } catch (ex) {
        console.log(`fingerprint-auth.available: ${ex}`);
        // if no identities are enrolled, there will be an exception (so not using 'reject' here)
        resolve({
          any: false
        });
      }
    });
  }

  public didFingerprintDatabaseChange(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const laContext = LAContext.new();

        // we expect the dev to have checked 'isAvailable' already so this should not return an error,
        // we do however need to run canEvaluatePolicy here in order to get a non-nil evaluatedPolicyDomainState
        if (!laContext.canEvaluatePolicyError(LAPolicy.DeviceOwnerAuthenticationWithBiometrics)) {
          reject("Not available");
          return;
        }

        // only supported on iOS9+, so check this.. if not supported just report back as false
        if (iOSUtils.MajorVersion < 9) {
          resolve(false);
          return;
        }

        const FingerprintDatabaseStateKey = "FingerprintDatabaseStateKey";
        const state = laContext.evaluatedPolicyDomainState;
        if (state !== null) {
          const stateStr = state.base64EncodedStringWithOptions(0);
          const storedState = NSUserDefaults.standardUserDefaults.stringForKey(FingerprintDatabaseStateKey);

          // Store enrollment
          NSUserDefaults.standardUserDefaults.setObjectForKey(stateStr, FingerprintDatabaseStateKey);
          NSUserDefaults.standardUserDefaults.synchronize();

          // whenever a finger is added/changed/removed the value of the storedState changes,
          // so compare agains a value we previously stored in the context of this app
          const changed = storedState !== null && stateStr !== storedState;
          resolve(changed);
        }
      } catch (ex) {
        console.log(`Error in fingerprint-auth.didFingerprintDatabaseChange: ${ex}`);
        resolve(false);
      }
    });
  }

  /**
   * This implementation uses LocalAuthentication and has no built-in passcode fallback
   */
  public verifyFingerprint(
      options: VerifyFingerprintOptions,
      usePasscodeFallback: boolean = false
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.laContext = LAContext.new();
        if (!this.laContext.canEvaluatePolicyError(LAPolicy.DeviceOwnerAuthenticationWithBiometrics)) {
          reject("Not available");
          return;
        }

        const message = (options !== null && options.message) || "Scan your finger";
        this.laContext.localizedFallbackTitle = '';

        this.laContext.evaluatePolicyLocalizedReasonReply(
            usePasscodeFallback ? LAPolicy.DeviceOwnerAuthentication : LAPolicy.DeviceOwnerAuthenticationWithBiometrics,
            message,
            (ok, error) => {
              if (ok) {
                resolve();
              } else {
                reject({
                  code: error.code,
                  message: error.localizedDescription
                });
              }
            }
        );
      } catch (ex) {
        console.log(`Error in fingerprint-auth.verifyFingerprint: ${ex}`);
        reject(ex);
      }
    });
  }

  public close(): void {
    if (this.laContext) {
      this.laContext.invalidate();
    }
  }
}
