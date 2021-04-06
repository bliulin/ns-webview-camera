import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { TransfersComponent } from './transfers.component';
import {
    AddNewPartnerFormComponent,
    FilboPartnerAssociationComponent,
    AddNewAccountFormComponent,
    PartnerDetailsComponent,
    InternalTransferComponent,
    InternaTransferConfirmComponent,
    ExternalTransferComponent,
    ExternalTransferConfirmComponent
} from './componenets';

const routes: Routes = [
    {
        path: '',
        component: TransfersComponent
    },
    {
        path: 'partner',
        children: [
            {
                path: ':id/details',
                component: PartnerDetailsComponent
            },
            {
                path: 'add',
                component: AddNewPartnerFormComponent
            },
            {
                path: 'filbo',
                component: FilboPartnerAssociationComponent
            },
            {
                path: 'account/add',
                component: AddNewAccountFormComponent
            }
        ]
    },
    {
        path: 'transfer',
        children: [
            {
                path: 'internal',
                component: InternalTransferComponent
            },
            {
                path: 'internal-confirm',
                component: InternaTransferConfirmComponent
            },
            {
                path: 'external',
                component: ExternalTransferComponent
            },
            {
                path: 'external-confirm',
                component: ExternalTransferConfirmComponent
            }
        ]
    }
];
@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class TransfersRoutingModule {}
