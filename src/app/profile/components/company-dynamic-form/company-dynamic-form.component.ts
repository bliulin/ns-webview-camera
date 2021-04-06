import { Component, OnInit } from "@angular/core";
import { Feature } from "~/app/core/models/feature";
import { QuestionnaireClosedEventArgs } from "~/app/credit-request/questionnaire/models/questionnaire-closed-event-args";
import { RouterExtensions } from "nativescript-angular";
import { CompanyStateService } from "~/app/profile/company/services/company-state.service";
import { traceDebug } from "~/app/core/logging/logging-utils";
import { ActivatedRoute } from "@angular/router";

@Component({
    templateUrl: './company-dynamic-form.component.html'
})
export class CompanyDynamicFormComponent implements OnInit {

    public Feature: typeof Feature = Feature;

    public dynamicFormId: string;
    public title: string;

    constructor(private routerExtensions: RouterExtensions,
                private route: ActivatedRoute,
                private companyStateService: CompanyStateService) {}

    public ngOnInit(): void {
        const id = this.route.snapshot.params.id;
        this.dynamicFormId = id;
    }

    public onQuestionnaireClosed($event: QuestionnaireClosedEventArgs): void {
        traceDebug('Questionnaire closed event');
        if ($event.completed) {
            this.companyStateService.companyDetails.kycDynamicFormCompleted = true;
            traceDebug('set kycDynamicFormCompleted to true');
        }
        this.navigateBack();
    }

    private navigateBack(): void {
        this.routerExtensions.backToPreviousPage();
    }
}
