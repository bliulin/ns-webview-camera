import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { EWalletComponent } from './e-wallet.component';
import { EWalletRoutingModule } from './e-wallet-routing.module';
import {
    NoCardAddedComponent,
    SetCardPinComponent,
    ConfirmCardPinComponent,
    DeliveryAdressFormComponent,
    CardNameFormComponent,
    FinishCardCreationComponent,
    CardAddButtonComponent,
    SettingsCardComponent,
    TradingLimitsSelectionComponent,
    TradingLimitsDescriptionComponent,
    SettingsPageComponent,
    SettingRowComponent,
    BlockCardReasonsComponent,
    SwitchCurrentCardComponent,
    ChangeCardPinComponent,
    ConfirmChangeCardPinComponent
} from './components';
import { SharedModule } from '../shared/shared.module';
import { CardDetailsComponent } from './components/card-details/card-details.component';
import { CardNumberComponent, CreditCardComponent } from './shared';
import { EWalletSettingsApiService } from './services/e-wallet-settings-api.service';
import { CreateCardService } from './components/create-card/create-card.service';
import { ShowPinComponent } from './components/show-pin/show-pin.component';

@NgModule({
    imports: [EWalletRoutingModule, SharedModule],
    declarations: [
        EWalletComponent,
        NoCardAddedComponent,
        SetCardPinComponent,
        ConfirmCardPinComponent,
        DeliveryAdressFormComponent,
        CardDetailsComponent,
        CardNameFormComponent,
        FinishCardCreationComponent,
        CardAddButtonComponent,
        SettingsCardComponent,
        TradingLimitsSelectionComponent,
        TradingLimitsDescriptionComponent,
        CardNumberComponent,
        SettingsPageComponent,
        CreditCardComponent,
        SettingRowComponent,
        ShowPinComponent,
        BlockCardReasonsComponent,
        SwitchCurrentCardComponent,
        ChangeCardPinComponent,
        ConfirmChangeCardPinComponent
    ],
    entryComponents: [
        TradingLimitsSelectionComponent,
        ShowPinComponent,
        BlockCardReasonsComponent,
        SwitchCurrentCardComponent
    ],
    providers: [EWalletSettingsApiService, CreateCardService],
    schemas: [NO_ERRORS_SCHEMA]
})
export class EWalletModule {}
