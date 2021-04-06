import {
    Component,
    OnInit,
    Input,
    ViewContainerRef
} from '@angular/core';
import { Color } from 'tns-core-modules/color';
import { RouterExtensions } from 'nativescript-angular';
import { EligibleProductOutputModel } from '~/app/credit-request/models/eligibleProductOutputModel';
import { UserProfileStateService } from '~/app/core/services/profile/user-profile-state.service';
import { Observable, of } from 'rxjs';
import { User } from '~/app/core/models/user.model';
import { device } from '@nativescript/core/platform';
import { BottomSheetOptions } from 'nativescript-material-bottomsheet/angular';
import { PercentageModalComponent } from './percentage-modal/percentage-modal.component';
import { map } from 'rxjs/operators';
import { PercentageModal } from './percentage-modal/percentage-modal.model';
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { CreditRequestControllerService } from "~/app/credit-request/services/credit-request-controller.service";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsDashboardEvents } from "~/app/core/models/app-insights-events";

const orange = 'rgba(251, 103, 1, 1)';
const green = 'rgba(136, 188, 8, 1)';
const gray = 'rgba(214, 217, 224, 1)';

const defaultProductType = 'Filbo';

@Component({
    selector: 'omro-eligible-standard-product',
    templateUrl: './eligible-standard-product.component.html',
    styleUrls: ['./eligible-standard-product.component.scss']
})
export class EligibleStandardProductComponent implements OnInit {
    @Input()
    public eligibleProduct: EligibleProductOutputModel;
    public user$: Observable<User>;

    public borderFillColor: Color;
    public indicatorFillColor: Color;

    public showImage: boolean;

    // verify if it is tablet (it's used just as a future example):
    public isTablet: boolean = device.deviceType === 'Tablet';

    constructor(
        private routerExtensions: RouterExtensions,
        private userProfileService: UserProfileStateService,
        private omroModalService: OmroModalService,
        private containerRef: ViewContainerRef,
        private creditRequestControllerService: CreditRequestControllerService,
        private analyticsService: AnalyticsService
    ) {}

    public ngOnInit(): void {
        this.user$ = this.userProfileService.user$;
        this.setIndicatorFillColor();

        setTimeout(() => (this.showImage = true), 500);
    }

    public onPercentageTap(): void {
        this.showPercentageModal();
    }

    public onValidateTap(): void {
        this.analyticsService.trackEvent(AppInsightsDashboardEvents.DashboardProductRequestNew, this.routerExtensions.router.url);
        this.creditRequestControllerService.initiateProductRequest(false);
    }

    public setIndicatorFillColor(): void {
        if (this.eligibleProduct.productType === defaultProductType) {
            const appSuccesRate = this.eligibleProduct.approvalSuccessRate;
            if (this.eligibleProduct.isApplyAvailable && appSuccesRate > 0) {
                switch (appSuccesRate > 0 && appSuccesRate < 50) {
                    case true:
                        this.indicatorFillColor = new Color(orange);
                        break;
                    case false:
                        this.indicatorFillColor = new Color(green);
                        break;
                }
            } else {
                this.indicatorFillColor = new Color(gray);
            }
        }
    }

    private showPercentageModal(): void {
        const options: BottomSheetOptions = {
            viewContainerRef: this.containerRef,
            context: of(this.eligibleProduct).pipe(
                map(eligibleStandardProduct => <PercentageModal>{
                    indicatorFillColor: this.indicatorFillColor,
                    approvalSuccessRate: eligibleStandardProduct.approvalSuccessRate,
                    approvalSuccessDetail: eligibleStandardProduct.approvalSuccessDetail,
                    approvalSuccessTitle: eligibleStandardProduct.approvalSuccessTitle
                })
            ),
            transparent: true
        };

        this.omroModalService.showBottomSheet(PercentageModalComponent, options);
    }
}
