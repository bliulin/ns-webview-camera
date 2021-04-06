import { Component, OnInit } from '@angular/core';
import { BottomSheetParams } from 'nativescript-material-bottomsheet/angular';
import {
    BottomDialogButton,
    BottomDialogConfig,
    defaultBottomDialogButton,
    Orientation
} from '~/app/shared/models/bottom-dialog.config';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';

@Component({
    templateUrl: './bottom-dialog.component.html',
    styleUrls: ['./bottom-dialog.component.scss']
})
export class BottomDialogComponent implements OnInit {
    config: BottomDialogConfig<any>;
    columns: string;
    Orientation = Orientation;
    constructor(private params: BottomSheetParams, omroModalService: OmroModalService) {
        omroModalService.registerModalCallback(params.closeCallback);
        this.config = params.context;
        this.config.actions = this.config.actions
            .filter(action => !action.isHidden)
            .map(b => {
                return <BottomDialogButton<any>>{ ...defaultBottomDialogButton, ...b };
            });
        this.columns = this.config.actions.map(() => '*').join(',');
    }

    ngOnInit() {}

    public close(result: any) {
        this.params.closeCallback(result);
    }
}
