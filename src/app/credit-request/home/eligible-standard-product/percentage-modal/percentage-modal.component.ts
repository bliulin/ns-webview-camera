import { Component, OnInit } from '@angular/core';
import { BottomSheetParams } from 'nativescript-material-bottomsheet/angular';
import { PercentageModal } from './percentage-modal.model';
import { Observable } from 'rxjs';
import { OmroModalService } from "~/app/shared/services/omro-modal.service";

@Component({
    selector: 'app-percentage-modal',
    templateUrl: './percentage-modal.component.html',
    styleUrls: ['./percentage-modal.component.scss']
})
export class PercentageModalComponent implements OnInit {
    public vm$: Observable<PercentageModal>;

    constructor(private params: BottomSheetParams, omroModalService: OmroModalService) {
        omroModalService.registerModalCallback(params.closeCallback);
    }

    public ngOnInit(): void {
        this.vm$ = this.params.context;
    }

    public close(): void {
        this.params.closeCallback();
    }
}
