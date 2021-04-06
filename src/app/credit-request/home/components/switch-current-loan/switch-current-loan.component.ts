import { Component, OnInit } from '@angular/core';
import { LoanActivityIconHintDictionary } from '../../loan-activities/loan-activity-icon-hint.dictionary';
import { BottomSheetParams } from 'nativescript-material-bottomsheet/angular';
import { LoanSelection } from './loan-selection.model';
import { Observable } from 'rxjs';
import { UiService } from '~/app/credit-request/services/ui.service';
import { LocaleService } from '~/app/core/services/locale.service';
import { Color } from 'tns-core-modules/color/color';
import { AppColors } from '~/app/shared/constants';
import { isValidColor } from '~/app/shared/utils/utils';
import { OmroModalService } from "~/app/shared/services/omro-modal.service";

@Component({
    selector: 'omro-switch-current-loan',
    templateUrl: './switch-current-loan.component.html',
    styleUrls: ['./switch-current-loan.component.scss']
})
export class SwitchCurrentLoanComponent implements OnInit {
    public loans$: Observable<LoanSelection[]>;

    public loanActivityIconHintMapper: typeof LoanActivityIconHintDictionary = LoanActivityIconHintDictionary;
    constructor(private params: BottomSheetParams, private service: UiService, public localeService: LocaleService, omroModalService: OmroModalService) {
        omroModalService.registerModalCallback(params.closeCallback);
    }

    public ngOnInit(): void {
        this.loans$ = this.params.context;
    }

    public switchLoanAndCloseBottomSheet(selectedLoanId: string): void {
        this.service.setCurrentLoan(selectedLoanId);
        setTimeout(() => this.params.closeCallback(), 300);
    }

    public getColor(color: string): Color {
        if (isValidColor(color)) {
            return new Color(color);
        }
        return new Color(AppColors.Green);
    }

    public getBackgroundColor(color?: string): Color {
        let colorAsRgb: any;
        if (isValidColor(color)) {
            colorAsRgb = this.hexToRgb(color);
        } else {
            colorAsRgb = this.hexToRgb(AppColors.Green);
        }
        return new Color(50, colorAsRgb.r, colorAsRgb.g, colorAsRgb.b);
    }

    private hexToRgb(hex: string): any {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16)
              }
            : null;
    }
}
