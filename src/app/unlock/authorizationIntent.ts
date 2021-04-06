import { Observable, Subject } from "rxjs";
import { AuthorizationResult } from "~/app/unlock/authorization-result";

export class AuthorizationIntent {
    private subject = new Subject<void>();

    public get observable(): Observable<void> {
        return this.subject.asObservable();
    }

    public resolve(result: AuthorizationResult) {
        if (result === AuthorizationResult.Success) {
            this.subject.next();
            this.subject.complete();
        } else {
            this.subject.error(null);
        }
    }
}
