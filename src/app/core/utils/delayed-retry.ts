import { Observable, of, throwError } from "rxjs";
import { delay, mergeMap, retryWhen } from "rxjs/internal/operators";

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_DELAY_MS = 100;

const getErrorMessage = (maxRetry: number) => `Tried to load resource over XHR for ${maxRetry} times without success. Giving up.`;

export function delayedRetry(delayedMs: number = DEFAULT_DELAY_MS, maxRetry: number = DEFAULT_MAX_RETRIES): ((obs: Observable<any>) => Observable<any>) {
    let retries = maxRetry;

    return (src: Observable<any>) =>
        src.pipe(
            retryWhen((errors: Observable<any>) => errors.pipe(
                delay(delayedMs),
                mergeMap(error => retries-- > 0 ? of(error) : throwError(getErrorMessage(maxRetry)))
            ))
        );
}
