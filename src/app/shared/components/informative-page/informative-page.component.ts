import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InfoPageModel } from "~/app/shared/components/informative-page/info-page-model";

@Component({
    selector: 'omro-informative-page',
    templateUrl: './informative-page.component.html',
    styleUrls: ['./informative-page.component.scss']
})
export class InformativePageComponent {
    @Input()
    public vm: InfoPageModel = {};

    @Output()
    public pageClosed: EventEmitter<any> = new EventEmitter();

    @Output()
    public actionButtonTap: EventEmitter<any> = new EventEmitter();

    public onClosed(): void {
        this.pageClosed.emit();
    }

    public onActionButtonTapped(): void {
        this.actionButtonTap.emit();
    }
}
