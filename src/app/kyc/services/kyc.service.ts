import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from "rxjs";
import { KycApiService } from "../../kyc/services/kyc-api.service";
import { filter, switchMap, tap } from "rxjs/internal/operators";
import { UserKYCOutputModel } from "~/app/kyc/models/userKYCOutputModel";
import { UserKYCUrlOutputModel } from "~/app/kyc/models/userKYCUrlOutputModel";
import { RouterExtensions } from 'nativescript-angular';
import { NavigationSource } from "~/app/shared/app.enums";

@Injectable()
export class KycService {

    private _index: number = 0;
    private _initialized: boolean;
    private _kycModel$: BehaviorSubject<UserKYCOutputModel> = new BehaviorSubject(null);
    private _kycCurrentStepIndex$: BehaviorSubject<number> = new BehaviorSubject(0);
    private _sessiodId: string;

    public source: NavigationSource;

    constructor(private api: KycApiService,
                private routerExtensions: RouterExtensions,
                ) {
    }

    public get initialized(): boolean {
        return this._initialized;
    }

    public get sessiodId(): string {
        return this._sessiodId;
    }

    public initKyc(): Observable<UserKYCOutputModel> {
        if (this._initialized) {
            return this._kycModel$;
        }
        return this.api.initKycProcess().pipe(tap(model => {
            this._kycModel$.next(model);
            this._sessiodId = model.sessionId;
            this._initialized = true;
        }));
    }

    public userCompletedKyc(productRequestId: string, sessiondId: string): void {
        this.api.userCompletedKycProcess(productRequestId, sessiondId).toPromise();
    }

    public advance(): void {
        this._kycCurrentStepIndex$.next(++this._index);
    }

    public goBack(): void {
        this._kycCurrentStepIndex$.next(--this._index);
    }

    public currentStep(): Observable<UserKYCUrlOutputModel> {
        return combineLatest([this._kycModel$, this._kycCurrentStepIndex$])
            .pipe(filter(([model, currentIndex]) => !!model && currentIndex >= 0),
                switchMap(([model, currentIndex]) => {
                    const iFrameModel = currentIndex < model.iFrameURLs.length ? model.iFrameURLs[currentIndex] : null;
                    return of(iFrameModel);
                }));
    }

    public get currentStepIndex(): Observable<number> {
        return this._kycCurrentStepIndex$;
    }

    public get totalSteps(): Observable<number> {
        return this._kycModel$.pipe(filter(m => !!m),
            switchMap((value: UserKYCOutputModel) => of(value.iFrameURLs.length)));
    }

    public get finished(): Observable<boolean> {
        return combineLatest([this.currentStepIndex, this.totalSteps])
            .pipe(switchMap(([index, count]) => {
                return of(index >= count);
            }));
    }

    public get canGoBack(): Observable<boolean> {
        return this.currentStepIndex.pipe(switchMap(index => of(index > 0)));
    }

    public get sourceUrl(): string {
        const url = this.source === NavigationSource.UserProfile ? 'profile' : 'home';
        return url;
    }

    public reset(): void {
        this._initialized = false;
        this._index = 0;
        this._kycCurrentStepIndex$.next(0);
        this._kycModel$.next(null);
    }
}
