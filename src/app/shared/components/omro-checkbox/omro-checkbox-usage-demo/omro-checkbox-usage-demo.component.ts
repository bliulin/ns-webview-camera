import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'omro-omro-checkbox-usage-demo',
    templateUrl: './omro-checkbox-usage-demo.component.html',
    styleUrls: ['./omro-checkbox-usage-demo.component.scss']
})
export class OmroCheckboxUsageDemoComponent implements OnInit {
    public formGroup: FormGroup;

    constructor(private page: Page, private formBuilder: FormBuilder) {
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.buildForm();
    }

    public displayAlert(): void {
        alert('GDPR content');
    }

    private buildForm(): void {
        this.formGroup = this.formBuilder.group({
            defaultCheckbox: [true, [Validators.requiredTrue]],
            customCheckbox: [true, [Validators.requiredTrue]],
            thirdheckbox: [false, [Validators.requiredTrue]],
            radioButton: [true, [Validators.requiredTrue]]
        });
    }
}
