import { Subject } from "rxjs";

export class CancelToken {
    constructor(private subject: Subject<any>) {

    }

    public cancel() {
        this.subject.next();
        this.subject.complete();
    }
}
