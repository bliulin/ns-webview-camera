
export enum PinUnlockResult {
    OK, Invalid, TooManyAtempts
}

export class PinUnlockSession {
    private attempts: number = 0;

    public constructor(private userPin: string, private maxAttempts: number) {

    }

    public tryUnlock(pin: string): PinUnlockResult {
        this.attempts++;
        if (pin === this.userPin) {
            return PinUnlockResult.OK;
        }
        if (this.attempts >= this.maxAttempts) {
            return PinUnlockResult.TooManyAtempts;
        }
        return PinUnlockResult.Invalid;
    }
}
