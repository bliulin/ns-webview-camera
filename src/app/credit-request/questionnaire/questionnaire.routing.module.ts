import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular";
import { Routes } from "@angular/router";
import { QuestionnaireComponent } from "~/app/credit-request/questionnaire/questionnaire.component";

const routes: Routes = [
    { path: "", component: QuestionnaireComponent, pathMatch: "full" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class QuestionnaireRoutingModule {
}
