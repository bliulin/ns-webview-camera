export class ValidationCodeRequest {
    public registrationId: string;
    public emailValidationCode: string;

    public constructor(init?: Partial<ValidationCodeRequest>) {
        Object.assign(this, init);
    }
}
