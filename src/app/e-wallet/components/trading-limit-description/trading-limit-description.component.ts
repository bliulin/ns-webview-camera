import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'tns-core-modules/ui/page/page';
import { RouterExtensions } from 'nativescript-angular';
import { BaseComponent } from '~/app/shared/base.component';
import { Observable } from 'rxjs';
import { TradingLimitUpdateModel } from '../../models';
import { tap, takeUntil, take } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { TradingLimitDescriptionService } from './trading-limit-description.service';
import { NotificationBannerService } from '~/app/shared/services';

@Component({
    selector: 'omro-trading-limit-description',
    templateUrl: './trading-limit-description.component.html',
    styleUrls: ['./trading-limit-description.component.scss'],
    providers: [TradingLimitDescriptionService]
})
export class TradingLimitsDescriptionComponent extends BaseComponent implements OnInit {
    public vm$: Observable<TradingLimitUpdateModel>;

    public newAmountFormControl: FormControl;
    constructor(
        routerExtensions: RouterExtensions,
        private route: ActivatedRoute,
        private page: Page,
        private controllerService: TradingLimitDescriptionService,
        private notificationBannerService: NotificationBannerService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        const id = this.route.snapshot.params.id;
        this.controllerService.changeCardTradingLimitSelection(id);
        this.vm$ = this.controllerService.tradingLimitUpdateVM$.pipe(
            tap(
                (cardTradingLimit) =>
                    (this.newAmountFormControl = new FormControl('', [
                        Validators.required,
                        Validators.min(0),
                        Validators.max(cardTradingLimit.maximumLimit)
                    ]))
            )
        );
    }

    public onCloseButtonTap(): void {
        super.goBack();
    }

    public onNextTap(limitId: string): void {
        if (!this.newAmountFormControl.valid) {
            return;
        }
        this.controllerService
            .updateTradingLimit({ limitId: limitId, newAmount: this.newAmountFormControl.value })
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (success) => this.handleSuccess(),
                (error) => this.handleError(error)
            );
    }

    private handleSuccess(): void {
        super.goBack();
        this.controllerService.reloadEWalletVm();
    }

    private handleError(error: any): void {
        const errorDetails = error.error || null;
        this.notificationBannerService.showError(errorDetails);
    }
}
