import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { auditTime, distinctUntilChanged, map } from 'rxjs/internal/operators';

@Injectable({
    providedIn: 'root'
})
export class ActivityLoaderService {
    public activeRequests$: BehaviorSubject<number>;
    public isLoading$: Observable<boolean>;

    constructor() {
        this.activeRequests$ = new BehaviorSubject(0);
        this.isLoading$ = this.activeRequests$.pipe(
            map(requests => requests > 0),
            auditTime(100), // this is to prevent a flicker on the activity indicator when
            distinctUntilChanged() // multiple HTTP requests are performed sequential
        );
    }

    public onRequestStart(): void {
        setTimeout(() => this.activeRequests$.next(this.activeRequests$.value + 1), 10);
    }

    public onRequestEnd(): void {
        setTimeout(() => this.activeRequests$.next(this.activeRequests$.value - 1), 10);
    }
}
