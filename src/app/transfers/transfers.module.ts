import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransfersComponent } from './transfers.component';
import { TransfersRoutingModule } from './transfers-routing.module';
import {
    BusinessPartnersCardComponent,
    AddNewPartnerFormComponent,
    InternalTransferComponent,
    FilboPartnerAssociationComponent,
    AddNewAccountFormComponent,
    PartnerDetailsComponent
} from './componenets';
import { OmroHorizontalButtonComponent } from './shared';
import { SharedModule } from '../shared/shared.module';
import { InternaTransferConfirmComponent } from './componenets/interna-transfer-confirm/interna-transfer-confirm.component';
import { ExternalTransferComponent } from './componenets/external-transfer/external-transfer.component';
import { ExternalTransferConfirmComponent } from './componenets/external-transfer-confirm/external-transfer-confirm.component';
import { FundsArriveInstantlyLabelComponent } from './componenets/funds-arrive-instantly-label/funds-arrive-instantly-label.component';

@NgModule({
    imports: [CommonModule, TransfersRoutingModule, SharedModule],
    declarations: [
        TransfersComponent,
        BusinessPartnersCardComponent,
        OmroHorizontalButtonComponent,
        AddNewPartnerFormComponent,
        FilboPartnerAssociationComponent,
        InternalTransferComponent,
        InternaTransferConfirmComponent,
        AddNewAccountFormComponent,
        PartnerDetailsComponent,
        ExternalTransferComponent,
        ExternalTransferConfirmComponent,
        FundsArriveInstantlyLabelComponent
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class TransfersModule {}
