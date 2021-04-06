import { Component, Output, EventEmitter } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';
import { BaseComponent } from '~/app/shared/base.component';

@Component({
    selector: 'omro-add-account-button',
    templateUrl: './add-account-button.component.html',
    styleUrls: ['./add-account-button.component.scss']
})
export class AddAccountButtonComponent extends BaseComponent {
    @Output() public addCardPressed = new EventEmitter();
    constructor(routerExtensions: RouterExtensions) {
        super(routerExtensions);
    }

    public onAddCardTap(): void {
        this.addCardPressed.emit();
    }
}
