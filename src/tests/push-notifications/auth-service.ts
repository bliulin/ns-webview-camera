import { BehaviorSubject } from "rxjs";
import { AuthenticationService } from "~/app/core/authentication/authentication.service";
import { MessagingService } from "~/app/core/services/messaging.service";

export class AuthServiceKyc extends AuthenticationService {
    private _authenticated$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    public static create(): AuthServiceKyc {
        const instance = new AuthServiceKyc(null, null, null, null, new MessagingService());
        return instance;
    }

    public get authenticated$(): BehaviorSubject<boolean> {
        return this._authenticated$;
    }
}
