import { takeUntil } from 'rxjs/internal/operators';
import { Observable, ReplaySubject, Subject } from 'rxjs';

export class CachedObservable<T> extends Observable<T> {
    private reload$: Subject<any> = new Subject();
    private _replaySubject: ReplaySubject<T>;
    private _hasError = false;

    constructor(private observable: Observable<T>) {
        super(subscriber => {
            if (!this._replaySubject || this._hasError) {
                this._hasError = false;
                this._replaySubject = new ReplaySubject<T>(1);
                this.subscribeToSource();
            }
            return this._replaySubject.subscribe(
                val => subscriber.next(val),
                error => subscriber.error(error),
                () => subscriber.complete()
            );
        });
    }

    private subscribeToSource() {
        this.observable.pipe(takeUntil(this.reload$)).subscribe(
            val => this._replaySubject.next(val),
            err => {
                this._replaySubject.error(err);
                this._hasError = true;
            },
            () => {}
        );
    }

    /**
     * Instantly reloads the data and sends it to existing subscribers
     */
    public reload(): void {
        if (this._replaySubject) {
            this.reload$.next();
            this.subscribeToSource();
        }
    }

    /**
     * Invalidates the cache and completes the existing subscriptions.
     * Consumers need to subscribe again to receive new data
     */
    public invalidate(): void {
        if (this._replaySubject) {
            this.reload$.next();
            this._replaySubject.complete();
            this._replaySubject = null;
        }
    }
}
