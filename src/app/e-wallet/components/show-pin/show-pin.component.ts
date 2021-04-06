import { Component } from '@angular/core';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { BottomSheetParams } from 'nativescript-material-bottomsheet/angular';
import { timer } from 'rxjs';
import { takeWhile } from 'rxjs/internal/operators';

@Component({
    templateUrl: './show-pin.component.html',
    styleUrls: ['./show-pin.component.scss']
})
export class ShowPinComponent {
    private pin: string;
    seconds: number = 5;
    constructor(private params: BottomSheetParams, omroModalService: OmroModalService) {
        omroModalService.registerModalCallback(params.closeCallback);
        this.pin = params.context.pin;
        timer(1000, 1000)
            .pipe(takeWhile(() => this.seconds > 0))
            .subscribe(
                () => this.seconds--,
                () => {},
                () => this.params.closeCallback()
            );
    }
}
