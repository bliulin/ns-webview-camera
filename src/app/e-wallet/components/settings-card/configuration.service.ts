import { Injectable, ViewContainerRef } from '@angular/core';
import { EWalletApiService } from '../../services/e-wallet-api.service';
import { CardBlockModel, CardBlockReason } from '../../models/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { TradingLimitsSelectionComponent, BlockCardReasonsComponent, BlockCardReasonsModalResult } from '..';
import { TradingLimitModel, BlockCardReasonsDictionary, CardModifyStateAction } from '../../models';
import { EWalletStateService } from '../../services/e-wallet-state.service';
import { BottomSheetOptions } from 'nativescript-material-bottomsheet/angular';
import localize from 'nativescript-localize';
import { BottomDialogButtonType } from '~/app/shared/models/bottom-dialog.config';
import { DialogResult } from '~/app/shared/app.enums';

@Injectable()
export class ConfigurationService {
    private blockCardReasons: typeof BlockCardReasonsDictionary = BlockCardReasonsDictionary;
    constructor(
        private omroModalService: OmroModalService,
        private stateService: EWalletStateService,
        private apiService: EWalletApiService
    ) {}

    public makeAction(action: CardModifyStateAction, reason?: CardBlockReason): Observable<void> {
        const cardId = this.stateService.selectedCardId;
        return action === CardModifyStateAction.Block
            ? this.blockCard(<CardBlockModel>{
                  cardId: cardId,
                  reason: reason as CardBlockReason
              })
            : this.activateCard(cardId);
    }

    public showTransactionsLimitsModal(containerRef: ViewContainerRef): Observable<string> {
        const options: BottomSheetOptions = {
            viewContainerRef: containerRef,
            context: this.stateService.currentCardLimits$.pipe(
                map((cardLimits) =>
                    cardLimits.map(
                        (limit) =>
                            <TradingLimitModel>{
                                id: limit.limitId,
                                currentAmount: limit.currentAmount,
                                name: limit.name,
                                icon: limit.icon
                            }
                    )
                )
            ),
            transparent: true
        };
        return this.omroModalService.showBottomSheet(TradingLimitsSelectionComponent, options);
    }

    public showBlockCardReasonsModal(containerRef: ViewContainerRef): Observable<BlockCardReasonsModalResult> {
        const options: BottomSheetOptions = {
            viewContainerRef: containerRef,
            transparent: true,
            context: { reasons: this.blockCardReasons }
        };
        return this.omroModalService.showBottomSheet<BlockCardReasonsModalResult>(BlockCardReasonsComponent, options);
    }

    public showBlockCardConfirmation(containerRef: ViewContainerRef): Observable<DialogResult> {
        return this.omroModalService.showYesNoDialog({
            viewContainerRef: containerRef,
            title: localize('Common.AreYouSure'),
            message: localize('EWallet.Configuration.BlockCard.ConfirmationModalCardBlockDetails'),
            yesButtonType: BottomDialogButtonType.Error
        });
    }

    public showActivateCardConfiramtion(containerRef: ViewContainerRef): Observable<DialogResult> {
        return this.omroModalService.showYesNoDialog({
            viewContainerRef: containerRef,
            title: localize('Common.AreYouSure'),
            message: localize('EWallet.Configuration.BlockCard.ConfirmationModalActivateCardDetails'),
            yesButtonType: BottomDialogButtonType.Primary
        });
    }

    private blockCard(blockModel: CardBlockModel): Observable<void> {
        return this.apiService.blockCard(blockModel);
    }

    private activateCard(cardId: string): Observable<void> {
        return this.apiService.activateCard(cardId);
    }
}
