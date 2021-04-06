import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { QuestionnaireComponent } from "~/app/credit-request/questionnaire/questionnaire.component";
import { SharedModule } from "~/app/shared/shared.module";
import { QuestionnaireRoutingModule } from "~/app/credit-request/questionnaire/questionnaire.routing.module";
import { DynamicFormApiService } from "~/app/credit-request/questionnaire/services/dynamic-form-api.service";

@NgModule({
    imports: [
        QuestionnaireRoutingModule,
        SharedModule
    ],
    declarations: [
        QuestionnaireComponent
    ],
    providers: [DynamicFormApiService],
    exports: [
        QuestionnaireComponent
    ],
    entryComponents: [],
    schemas: [NO_ERRORS_SCHEMA]
})
export class QuestionnaireModule {}
