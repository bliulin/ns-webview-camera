import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ApplicationService } from '~/app/core/services/application.service';
import { CardUIState, CardViewModel } from '../../models/card-view-model';
import { EWalletStateService } from '../../services/e-wallet-state.service';
import { takeUntil } from 'rxjs/internal/operators';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { localize } from 'nativescript-localize';
import { Orientation } from '~/app/shared/models/bottom-dialog.config';
import { Observable } from 'rxjs';
import { ShowPinComponent } from '../show-pin/show-pin.component';
import { EWalletApiService } from '../../services/e-wallet-api.service';
import { NotificationBannerService } from '~/app/shared/services';
import { CardDetailsOutputModel } from '../../models/api';
import { CardVisual, CardVisualMapper } from '../../models/card-visual';
enum ShowCardDetailsAction {
    ShowPin,
    ShowDetails
}
@Component({
    selector: 'omro-card-details',
    templateUrl: './card-details.component.html',
    styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent extends BaseComponent implements OnInit {
    public uiState: CardUIState;
    public model: CardViewModel;
    public cardVisual: CardVisual;
    public cardDetails: CardDetailsOutputModel;

    constructor(
        private vcRef: ViewContainerRef,
        private service: EWalletStateService,
        private modalService: OmroModalService,
        private apiService: EWalletApiService,
        private notificationService: NotificationBannerService,
        application: ApplicationService,
        routerExt: RouterExtensions
    ) {
        super(routerExt, application);
    }

    public ngOnInit(): void {
        this.service.currentSelectedCard$.pipe(takeUntil(this.unsubscribe$)).subscribe(model => {
            this.model = model;
            this.cardVisual = model.cardVisual;
            this.uiState = model.uiState;
            this.cardDetails = null;
        });
    }

    public onShowDetailsTap() {
        this.showDetailsModal().subscribe(res => {
            switch (res) {
                case ShowCardDetailsAction.ShowPin:
                    this.application.authorizeAction().subscribe(
                        () => this.showPin(),
                        () => {}
                    );
                    break;
                case ShowCardDetailsAction.ShowDetails:
                    this.application.authorizeAction().subscribe(
                        () => this.showCardDetails(),
                        () => {}
                    );
                    break;
            }
        });
    }

    private showDetailsModal(): Observable<ShowCardDetailsAction> {
        return this.modalService.showBottomDialog({
            viewContainerRef: this.vcRef,
            title: localize('Common.Actions'),
            orientation: Orientation.Vertical,
            actions: [
                {
                    text: localize('EWallet.CardDetails.ShowCardDetails'),
                    result: ShowCardDetailsAction.ShowDetails,
                    isHidden: !!this.cardDetails
                },
                {
                    text: localize('EWallet.CardDetails.ShowPin'),
                    result: ShowCardDetailsAction.ShowPin
                }
            ]
        });
    }

    private showCardDetails() {
        this.apiService.getCardDetails(this.model.cardId).subscribe(
            res => {
                this.cardDetails = res;
                this.cardVisual = CardVisualMapper.create(this.model, this.cardDetails);
            },
            err => this.handleError(err)
        );
    }

    private showPin() {
        this.apiService.getCardPin(this.model.cardId).subscribe(
            res => {
                this.modalService.showBottomSheet(ShowPinComponent, {
                    viewContainerRef: this.vcRef,
                    transparent: true,
                    context: { pin: res.pin }
                });
            },
            err => this.handleError(err)
        );
    }

    private handleError(err: any) {
        this.notificationService.showGenericError(err);
    }
}
