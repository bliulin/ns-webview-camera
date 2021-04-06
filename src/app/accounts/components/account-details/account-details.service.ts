import { Injectable, ViewContainerRef } from '@angular/core';
import { EligibleCardForAccount, CardType } from '../../models/api';
import { Observable } from 'rxjs';
import { BottomDialogButton, BottomDialogButtonType, Orientation } from '~/app/shared/models/bottom-dialog.config';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import localize from 'nativescript-localize';

@Injectable()
export class AccountDetailsService {

constructor(private omroModalService: OmroModalService) { }

public showCardSelectionModal(eligibleCards: EligibleCardForAccount[], containerRef: ViewContainerRef): Observable<any> {
    const bottomSheetDialogActions = eligibleCards.map(
        (eligibleCard) =>
            <BottomDialogButton<any>>{
                buttonType: BottomDialogButtonType.Secondary,
                text: eligibleCard.name,
                result: {
                    result: CardType[eligibleCard.cardType],
                    resultId: eligibleCard.productId
                }
            }
    );
    return this.omroModalService.showBottomDialog({
        viewContainerRef: containerRef,
        title: localize('EWallet.Homepage.NoCardsAdded.ModalTitle'),
        orientation: Orientation.Vertical,
        actions: bottomSheetDialogActions
    });
}

}
