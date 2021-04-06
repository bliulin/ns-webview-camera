import { Component, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';

@Component({
    selector: 'omro-card-add-button',
    templateUrl: './card-add-button.component.html',
    styleUrls: ['./card-add-button.component.scss']
})
export class CardAddButtonComponent extends BaseComponent {
    @Output() addCardPressed = new EventEmitter();
    constructor(routerExtensions: RouterExtensions) {
        super(routerExtensions);
    }

    public onAddCardTap(): void {
        this.addCardPressed.emit();
    }
}
