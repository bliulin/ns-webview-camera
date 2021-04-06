import { Component} from '@angular/core';
import { CreditRequestService } from '~/app/credit-request/services/credit-request.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retryWhen, switchMap } from 'rxjs/internal/operators';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular';
import { ProductRequestFlowOutputModel } from '~/app/credit-request/models/productRequestFlowOutputModel';
import { Page } from 'tns-core-modules/ui/page/page';
import { NotificationBannerService } from '~/app/shared/services';
import { ApplicationService } from '~/app/core/services/application.service';
import { BaseComponent } from '~/app/shared/base.component';

@Component({
    templateUrl: './credit-overview-page.component.html',
    styleUrls: ['./credit-overview-page.component.scss']
})
export class CreditOverviewPageComponent extends BaseComponent {
    private product$: Observable<ProductRequestFlowOutputModel>;

    constructor(
        private creditRequestService: CreditRequestService,
        private activatedRoute: ActivatedRoute,
        routerExtensions: RouterExtensions,
        private page: Page,
        private notificationService: NotificationBannerService,
        application: ApplicationService
    ) {
        super(routerExtensions, application);
        page.actionBarHidden = true;
        this.product$ = this.activatedRoute.paramMap
            .pipe(map(m => m.get('productRequestId')))
            .pipe(
                switchMap(id => {
                    this.creditRequestService.currentProductRequestId = id;
                    return this.creditRequestService.getCurrentProductRequest();
                })
            )
            .pipe(catchError(err => this.handleError(err)))
            .pipe(retryWhen(this.getNoConnectivityRetryStrategy()));
    }

    private handleError(err: any): Observable<never> {
        this.notificationService.showGenericError(err);
        return throwError(err);
    }

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }

    private onProductRequestCancelled() {
        this.application.goHome();
    }
}
