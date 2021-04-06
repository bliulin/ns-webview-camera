export class Account {
    public email: string;
    public cif: string;
    public termsAndConditionsAccepted: boolean;
    public marketingConsentIsGiven: boolean;

    public constructor(init?: Partial<Account>) {
        Object.assign(this, init);
    }
}
