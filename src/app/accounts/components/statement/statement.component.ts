import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { Observable } from 'rxjs';
import { AccountDetailsOutputModel, BalanceSheetModel } from '../../models/api';
import { AccountsStateService } from '../../services/accounts-state.service';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import localize from 'nativescript-localize';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tap, take } from 'rxjs/operators';
import { AccountsApiService } from '../../services/accounts-api.service';
import { NotificationBannerService } from '~/app/shared/services';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { CustomValidators } from '~/app/shared/validators/validators.component';
import { Field } from '~/app/shared/models';
import { formatDate } from '~/app/shared/utils/date-time-format-utils';

const _currentDate = new Date();

@Component({
    selector: 'omro-statement',
    templateUrl: './statement.component.html',
    styleUrls: ['./statement.component.scss']
})
export class StatementComponent extends BaseComponent implements OnInit {
    public vm$: Observable<AccountDetailsOutputModel>;
    public formGroup: FormGroup;

    public startDate: Field = { label: localize('Accounts.AccountDetails.Statement.StartDate') };
    public endDate: Field = { label: localize('Accounts.AccountDetails.Statement.EndDate') };

    public sendButtonIsEnabled: boolean = true;

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        public vcRef: ViewContainerRef,
        public modalDialogService: OmroModalService,
        private formBuilder: FormBuilder,
        private stateService: AccountsStateService,
        private apiService: AccountsApiService,
        private notificationBannerService: NotificationBannerService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.vm$ = this.stateService.currentAccountDetails$.pipe(
            tap((accountDetails) => this.buildForm(accountDetails.id))
        );
    }

    public get untilDateFormValue(): Date {
        return !!this.formGroup ? this.formGroup.controls.untilDate.value : this.currentDate;
    }

    public get fromDateFormValue(): Date {
        return !!this.formGroup ? this.formGroup.controls.fromDate.value : this.currentDate;
    }

    public get currentDate(): Date {
        return _currentDate;
    }

    public onClosed(): void {
        super.goBack();
    }

    public onNextTap(): void {
        this.apiService
            .getStatement(<BalanceSheetModel>{
                ...this.formGroup.value
            })
            .pipe(take(1))
            .subscribe(
                (success) => {
                    this.sendButtonIsEnabled = false;
                    this.notificationBannerService.showSuccess(
                        localize('Common.GenericSuccessMessage.title'),
                        localize('Common.GenericSuccessMessage.detail'),
                        1500
                    );
                    setTimeout(() => this.navigateToDashboard('accounts', 'slideRight', false), 1600);
                },
                (err) => this.notificationBannerService.showError(err.error)
            );
    }

    private buildForm(accountId: string): void {
        this.formGroup = this.formBuilder.group({
            accountId: accountId,
            fromDate: [
                null,
                [Validators.required, CustomValidators.dateMaximum(formatDate(this.untilDateFormValue, 'YYYY-MM-DD'))]
            ],
            untilDate: [
                null,
                [Validators.required, CustomValidators.dateMaximum(formatDate(this.currentDate, 'YYYY-MM-DD'))]
            ]
        });
    }
}
