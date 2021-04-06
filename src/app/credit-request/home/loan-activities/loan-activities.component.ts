import { Component, OnInit, Input } from '@angular/core';
import { LoansModuleActivityItem } from './loansModuleActivityItem';
import { LoanActivityIconHintDictionary } from './loan-activity-icon-hint.dictionary';

@Component({
    selector: 'omro-loan-activities',
    templateUrl: './loan-activities.component.html',
    styleUrls: ['./loan-activities.component.scss']
})
export class LoanActivitiesComponent implements OnInit {
    @Input() public activities: LoansModuleActivityItem[];

    public loanActivityIconHintMapper: typeof LoanActivityIconHintDictionary = LoanActivityIconHintDictionary;
    constructor() {}

    public ngOnInit(): void {}
}
