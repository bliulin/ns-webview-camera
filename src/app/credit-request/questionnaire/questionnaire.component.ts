import { Component, EventEmitter, Input, OnInit, Output, ViewContainerRef } from '@angular/core';
import { CreditRequestService } from '~/app/credit-request/services/credit-request.service';
import { DynamicFormBuilder } from './dynamic-form/dynamic-form-builder';
import { FormGroup } from '@angular/forms';
import { RouterExtensions } from 'nativescript-angular';
import { traceDebug, traceError } from '~/app/core/logging/logging-utils';
import { DynamicFormOutputModel } from '~/app/credit-request/models/dynamicFormOutputModel';
import { DynamicFormFieldOuputModel } from '~/app/credit-request/models/dynamicFormFieldOuputModel';
import { DynamicFormFieldRestrictions } from '~/app/credit-request/models/dynamicFormFieldRestrictions';
import { Page } from 'tns-core-modules/ui/page';
import { localize } from 'nativescript-localize';
import { DynamicFormApiService } from '~/app/credit-request/questionnaire/services/dynamic-form-api.service';
import { DynamicFormModel } from '~/app/credit-request/models/dynamicFormModel';
import { DynamicFormFieldModel } from '~/app/credit-request/models/dynamicFormFieldModel';
import { catchError, filter, map, switchMap, take } from 'rxjs/internal/operators';
import { MessagingService } from '~/app/core/services/messaging.service';
import { ProductRequestEvents } from '~/app/shared/constants';
import { Feature } from '~/app/core/models/feature';
import { QuestionnaireClosedEventArgs } from '~/app/credit-request/questionnaire/models/questionnaire-closed-event-args';
import { Observable, throwError } from 'rxjs';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { DialogResult } from '~/app/shared/app.enums';
import { NotificationBannerService } from '~/app/shared/services';
import { TopProgressModel } from '~/app/shared/components/top-progress/top-progress-model';
import { of } from 'rxjs/internal/observable/of';
import { BottomDialogButtonType } from "~/app/shared/models/bottom-dialog.config";
import { formatDate } from '~/app/shared/utils/date-time-format-utils';
import { ErrorMessages } from "~/app/credit-request/questionnaire/dynamic-form/error-messages";
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsProductRequestEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: 'omro-questionnaire',
    templateUrl: './questionnaire.component.html',
    styleUrls: ['./questionnaire.component.scss'],
})
export class QuestionnaireComponent implements OnInit {
    private dynamicForm: DynamicFormOutputModel;

    @Input()
    public title: string;

    @Input()
    public source: Feature = Feature.ProductRequest;

    @Output()
    public questionnaireClose: EventEmitter<QuestionnaireClosedEventArgs> = new EventEmitter();

    public formGroup: FormGroup;

    public Feature: typeof Feature = Feature;
    public topProgressModel$: Observable<TopProgressModel>;

    constructor(
        private page: Page,
        private routerExtensions: RouterExtensions,
        private creditRequestService: CreditRequestService,
        private formBuilder: DynamicFormBuilder,
        public modalDialogService: OmroModalService,
        public vcRef: ViewContainerRef,
        private apiService: DynamicFormApiService,
        private messagingService: MessagingService,
        private notificationBannerService: NotificationBannerService,
        private analyticsService: AnalyticsService
    ) {
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.creditRequestService.getCurrentProductRequest()
        .pipe(take(1))
        .subscribe(productRequest => {
            this.dynamicForm = productRequest.currentStage.stageDetails.dynamicForm;
            this.title = this.dynamicForm.title;
            this.formGroup = this.formBuilder.buildForm(this.dynamicForm);
        });

        if (this.source === Feature.ProductRequest) {
            this.topProgressModel$ = this.creditRequestService.getCurrentProductRequest().pipe(
                map(
                    flow =>
                        new TopProgressModel({
                            maxValue: flow.stages.length,
                            progressValue: 1 + flow.stages.findIndex(stage => stage === flow.currentStage),
                            showProgressValue: true
                        })
                )
            );
        } else {
            this.topProgressModel$ = of(new TopProgressModel({ showProgressValue: false }));
        }

        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.DynamicFormOpen, this.routerExtensions.router.url);
    }

    public hasError(fieldName: string): boolean {
        const f = this.formGroup.get(fieldName);
        return f.touched && f.invalid;
    }

    public get showValidation(): boolean {
        return !this.dynamicForm.readOnly;
    }

    public goBack(): void {
        this.routerExtensions.backToPreviousPage();
    }

    public getError(fieldName: string): string {
        return ErrorMessages.getError(fieldName, this.formGroup, this.dynamicForm);
    }

    public onTapContinue(): void {
        Object.keys(this.formGroup.controls).forEach(field => {
            const control = this.formGroup.get(field);
            control.markAsTouched();
        });

        if (!this.formGroup.valid) {
            traceDebug('Form not valid.');
        }

        const formData = this.formGroup.value;
        traceDebug('Form values: ' + JSON.stringify(formData));

        const model = this.createModelFromFormData(formData);
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.DynamicFormSubmit, this.routerExtensions.router.url, model);

        this.apiService
            .submitForm(model)
            .pipe(take(1))
            .subscribe(
                result => {
                    traceDebug(result);
                    this.handleCompleteAction(result);
                },
                error => {
                    traceError('Failed to submit form: ' + JSON.stringify(error));
                    this.analyticsService.trackEvent(AppInsightsProductRequestEvents.DynamicFormERROR, this.routerExtensions.router.url, error);
                }
            );
    }

    public onTapQuit(): void {
        this.triggerCancelProductRequest();
    }

    public getKeyboardType(field: DynamicFormFieldOuputModel): string {
        if (!field) {
            throw new Error('field');
        }
        if (field.restrictions === DynamicFormFieldRestrictions.Digits) {
            return 'number';
        }
        if (field.restrictions === DynamicFormFieldRestrictions.Email) {
            return 'email';
        }
        return undefined;
    }

    public onTapClose(): void {
        this.raiseCompletedEvent({
            completed: false
        });
    }

    public getInitialValue(field: DynamicFormFieldOuputModel): string {
        return field.submittedValue || field.defaultValue;
    }

    public isFirstCheckboxOfTypeCheckboxAndLabel(field: DynamicFormFieldOuputModel): boolean {
        return this.dynamicForm.formFields.find(formField => formField.label && formField.fieldType === 'Checkbox') === field;
    }

    private triggerCancelProductRequest(): void {
        this.confirmCancelProductRequest()
            .pipe(filter(r => r === DialogResult.Yes))
            .pipe(switchMap(() => this.creditRequestService.cancelProductRequest()))
            .pipe(take(1))
            .pipe(
                catchError(err => {
                    this.notificationBannerService.showGenericError();
                    return throwError(err);
                })
            )
            .subscribe();
    }

    private confirmCancelProductRequest(): Observable<DialogResult> {
        return this.modalDialogService.showYesNoDialog({
            viewContainerRef: this.vcRef,
            title: localize('ProductRequest.AreYouSure'),
            message: localize('ProductRequest.ConfirmCancelProductRequest'),
            yesButtonType: BottomDialogButtonType.Error
        });
    }

    private createModelFromFormData(formData: any): DynamicFormModel {
        const formModel = <DynamicFormModel>{};

        const fields = Object.keys(formData).map(
            key =>
                <DynamicFormFieldModel>{
                    dynamicFormFieldId: key,
                    value: this.formatValue(formData[key])
                }
        );

        formModel.fields = fields;
        formModel.dynamicFormId = this.dynamicForm.formId;

        return formModel;
    }

    private formatValue(value: any): any {
        return value instanceof Date ? formatDate(value, 'YYYY-MM-DD') : value;
    }

    private handleCompleteAction(result: any): void {
        this.analyticsService.trackEvent(AppInsightsProductRequestEvents.DynamicFormOK, this.routerExtensions.router.url, result);
        this.raiseCompletedEvent({
            completed: true
        });
    }

    private raiseCompletedEvent(args: QuestionnaireClosedEventArgs): void {
        this.questionnaireClose.emit(args);
        this.messagingService.raiseEvent<QuestionnaireClosedEventArgs>(
            ProductRequestEvents.QuestionnaireCompleted,
            args
        );
    }
}
