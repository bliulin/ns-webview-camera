import { Component, OnInit } from '@angular/core';
import { DialogResult } from '~/app/shared/app.enums';
import { BottomSheetParams } from 'nativescript-material-bottomsheet/angular';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { FormControl, Validators } from '@angular/forms';

export interface BlockCardReasonsModalResult {
    dialogResult: DialogResult;
    selectedReasons?: string[];
}

@Component({
    selector: 'omro-block-card-reasons',
    templateUrl: './block-card-reasons.component.html',
    styleUrls: ['./block-card-reasons.component.scss']
})
export class BlockCardReasonsComponent implements OnInit {
    public reasons: Map<string, string> = new Map<string, string>();
    public selectedReasonFormControl: FormControl;

    constructor(private params: BottomSheetParams, omroModalService: OmroModalService) {
        Object.assign(this.reasons, this.params.context.reasons);
        this.selectedReasonFormControl = new FormControl('', Validators.required);

        omroModalService.registerModalCallback(params.closeCallback);
    }
    public ngOnInit(): void {}

    public onBlockCardButtonTap(): void {
        const args = <BlockCardReasonsModalResult>{
            dialogResult: DialogResult.Yes,
            selectedReasons: this.selectedReasonFormControl.value
        };
        this.params.closeCallback(args);
    }

    public back(): void {
        this.params.closeCallback({ dialogResult: DialogResult.Cancel });
    }
}
