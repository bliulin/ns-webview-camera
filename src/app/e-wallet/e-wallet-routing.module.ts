import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule, NSEmptyOutletComponent } from 'nativescript-angular/router';
import { EWalletComponent } from './e-wallet.component';
import {
    SetCardPinComponent,
    ConfirmCardPinComponent,
    DeliveryAdressFormComponent,
    CardNameFormComponent,
    FinishCardCreationComponent,
    TradingLimitsDescriptionComponent,
    SettingsPageComponent,
    ChangeCardPinComponent,
    ConfirmChangeCardPinComponent
} from './components';

const routes: Routes = [
    {
        path: '',
        component: EWalletComponent
    },
    {
        path: 'card',
        children: [
            {
                path: '',
                component: NSEmptyOutletComponent,
                pathMatch: 'full'
            },
            {
                path: 'pin',
                children: [
                    { path: 'set', component: SetCardPinComponent },
                    { path: 'confirm', component: ConfirmCardPinComponent }
                ]
            },
            {
                path: 'delivery',
                component: DeliveryAdressFormComponent,
                pathMatch: 'full'
            },
            {
                path: 'name',
                component: CardNameFormComponent,
                pathMatch: 'full'
            },
            {
                path: 'finish',
                component: FinishCardCreationComponent,
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'configuration',
        children: [
            {
                path: '',
                component: NSEmptyOutletComponent,
                pathMatch: 'full'
            },
            {
                path: ':id/details',
                component: TradingLimitsDescriptionComponent,
                pathMatch: 'full'
            },
            {
                path: 'change-pin',
                children: [
                    { path: 'set', component: ChangeCardPinComponent },
                    { path: 'confirm', component: ConfirmChangeCardPinComponent }
                ]
            },
            {
                path: 'settings',
                component: SettingsPageComponent,
                pathMatch: 'full'
            }
        ]
    }
];
@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class EWalletRoutingModule {}
