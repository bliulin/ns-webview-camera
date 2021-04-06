import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CreditRequestApiService } from '~/app/credit-request/services/credit-request-api.service';
import { ProductRequestFlowOutputModel } from '~/app/credit-request/models/productRequestFlowOutputModel';
import { first, map, switchMap, tap } from 'rxjs/internal/operators';
import { CachedObservable } from '~/app/core/services/cached-observable';
import { traceDebug, traceError } from '~/app/core/logging/logging-utils';
import { filter } from 'rxjs/internal/operators/filter';
import { ProductOfferModel } from '~/app/credit-request/models/productOfferModel';
import { merge } from 'rxjs/internal/observable/merge';
import { ProductRequestModel } from '~/app/credit-request/models/productRequestModel';
import { OfferState } from '~/app/credit-request/models/types';
import { ProductRequestFlowViewModel } from './product-request-flow-view-model';
import { ProductRequestCancelationReasonOutputModel } from '~/app/credit-request/models/productRequestCancelationReasonOutputModel';
import { MessagingService } from '~/app/core/services/messaging.service';
import { AppEvents, ProductRequestEvents } from '~/app/shared/constants';

@Injectable({
    providedIn: 'root'
})
export class CreditRequestService {
    private _currentProductRequestSubject: Subject<ProductRequestFlowViewModel> = new Subject<
        ProductRequestFlowViewModel
    >();
    private _currentProductRequest: CachedObservable<ProductRequestFlowViewModel>;
    private _currentProductRequestIdSubj: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    public constructor(private apiService: CreditRequestApiService, private messagingService: MessagingService) {
        //current product request observable
        const currentProductRequestApiReq = this._currentProductRequestIdSubj
            .pipe(tap(id => traceDebug('[CreditService] Current product request changed ' + id)))
            .pipe(filter(id => !!id))
            .pipe(switchMap(id => this.apiService.getProductRequestFlow(id)))
            .pipe(map(p => new ProductRequestFlowViewModel(p)));

        const observable = merge(
            currentProductRequestApiReq,
            this._currentProductRequestSubject.pipe(
                tap(id => traceDebug('[CreditService] Current product request updated'))
            )
        );
        this._currentProductRequest = new CachedObservable(observable);
    }

    public get currentProductRequestId() {
        return this._currentProductRequestIdSubj.getValue();
    }

    public set currentProductRequestId(value: string) {
        traceDebug('Update product request ID to value ' + value);
        this._currentProductRequestIdSubj.next(value);
    }

    public getCurrentProductRequest(): Observable<ProductRequestFlowViewModel> {
        return this._currentProductRequest;
    }

    public requestNewProduct(productRequest: ProductRequestModel): Observable<ProductRequestFlowOutputModel> {
        return this.apiService.requestNewProduct(productRequest)
            .pipe(tap(result => {
                this._currentProductRequestIdSubj.next(result.productRequestSummary.productRequestId);
            }));
    }

    public checkOfferStatus(productRequestId: string): Observable<OfferState> {
        return this.apiService.checkOfferStatus(productRequestId)
            .pipe(map(state => state.replace(/"/g,"") as OfferState));
    }

    public async cancelProductRequest(cancelationCodes?: string[]): Promise<boolean> {
        traceDebug('[CreditService] Canceling product request ');
        const productRequestId = this._currentProductRequestIdSubj.value;
        try {
            await this.apiService.cancelProductRequest(productRequestId, cancelationCodes).toPromise();
            this.currentProductRequestId = null;
            this.invalidateCache();
            this.messagingService.raiseEvent(ProductRequestEvents.ProductRequestCancelled, productRequestId);
            return true;
        } catch (err) {
            traceError(err);
            return false;
        }
    }

    public async acceptOffer(productOfferModel: ProductOfferModel): Promise<boolean> {
        try {
            const result = await this.apiService.acceptOffer(productOfferModel).toPromise();
            this._currentProductRequestSubject.next(new ProductRequestFlowViewModel(result));
            return true;
        } catch (error) {
            traceError(error);
            return false;
        }
    }

    public async sendApproval(): Promise<boolean> {
        try {
            const productRequest = await this._currentProductRequest.pipe((first())).toPromise();
            const stageId = productRequest.currentStage.stageDetails.productRequestFlowStageId;
            const result = await this.apiService.sendApproval(stageId).toPromise();
            this._currentProductRequestSubject.next(new ProductRequestFlowViewModel(result));
            return true;
        } catch (error) {
            traceError(error);
            return false;
        }
    }

    public productRequestCancelationReasons(): Observable<ProductRequestCancelationReasonOutputModel> {
        return this.apiService.productRequestCancelationReasons();
    }

    public reload(): void {
        traceDebug('[CreditService] Reload');
        this._currentProductRequest.reload();
    }

    public invalidateCache(): void {
        traceDebug('[CreditService] Invalidated cache');
        this._currentProductRequest.invalidate();
    }
}
