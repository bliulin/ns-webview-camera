import { Component } from '@angular/core';
import { BaseUvpComponent } from '~/app/shared/base-uvp.component';
import { MessagingService } from '~/app/core/services/messaging.service';
import { ProductRequestEvents } from '~/app/shared/constants';

@Component({
    selector: 'omro-standard-product-overview',
    moduleId: module.id,
    templateUrl: './standard-product-overview.component.html'
})
export class StandardProductOverviewComponent extends BaseUvpComponent {
    constructor(private messagingService: MessagingService) {
        super();
    }

    public onSkipTap(): void {
        this.messagingService.raiseEvent(ProductRequestEvents.UvpCompleted, null);
    }

    public onScreenChanged(page: any): void {
        this.updateSelectedScreenIndex(page.index);
    }

    public onButtonTap(): void {
        this.handleButtonTap();
    }

    protected finish() {
        this.messagingService.raiseEvent(ProductRequestEvents.UvpCompleted, null);
    }
}
