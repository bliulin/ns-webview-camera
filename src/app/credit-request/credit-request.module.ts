import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedModule } from "~/app/shared/shared.module";
import { CreditRequestRoutingModule } from "~/app/credit-request/credit-request-routing.module";
import { ModalDialogService } from "nativescript-angular/directives/dialogs";
import { StandardProductOverviewComponent } from "./standard-product-overview/standard-product-overview.component";
import { CheckOfferStatusComponent } from "./credit-request-wizard/check-offer-status/check-offer-status.component";
import { NativeScriptUIGaugeModule } from "nativescript-ui-gauge/angular/gauges-directives";
import { ProductSelectionComponent } from './credit-request-wizard/product-selection/product-selection.component';
import { ProductCancelationReasonsModalComponent } from './components/product-cancelation-reasons-modal/product-cancelation-reasons-modal.component';
import { InitiateCreditRequestComponent } from "~/app/credit-request/credit-request-wizard/initiate-credit-request/initiate-credit-request.component";
import { StageContainerComponent } from "~/app/credit-request/stage-container/stage-container.component";
import { QuestionnaireModule } from "~/app/credit-request/questionnaire/questionnaire.module";
import { GenericStageTypeComponent } from "./credit-request-wizard/generic-stage-type/generic-stage-type.component";
import { UploadDocumentsModule } from "~/app/upload-documents/upload-documents.module";


@NgModule({
    declarations: [
        StandardProductOverviewComponent,
        InitiateCreditRequestComponent,
        CheckOfferStatusComponent,
        ProductSelectionComponent,
        ProductCancelationReasonsModalComponent,
        StageContainerComponent,
        GenericStageTypeComponent
    ],
    imports: [
        SharedModule,
        CreditRequestRoutingModule,
        NativeScriptUIGaugeModule,
        QuestionnaireModule,
        UploadDocumentsModule
    ],
    providers: [],
    exports: [],
    entryComponents:[ProductCancelationReasonsModalComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class CreditRequestModule {}
