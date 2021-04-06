import { Component, OnInit } from '@angular/core';
import { InfoPageModel } from '~/app/shared/components/informative-page/info-page-model';
import { Page } from 'tns-core-modules/ui/page/page';
import localize from 'nativescript-localize';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { CreateCardService } from '../create-card.service';

@Component({
    selector: 'omro-finish-card-creation',
    templateUrl: './finish-card-creation.component.html',
    styleUrls: ['./finish-card-creation.component.scss']
})
export class FinishCardCreationComponent extends BaseComponent implements OnInit {
    public vm: InfoPageModel;

    constructor(routerExtensions: RouterExtensions, private page: Page, private cardCreationService: CreateCardService) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public ngOnInit(): void {
        this.vm = <InfoPageModel>{
            title: localize('Common.GenericSuccessMessage.title'),
            imageSource: '~/app/images/thumbs_up.svg',
            description: this.cardCreationService.successMessage,
            actionButtonText: localize('Common.Next'),
            showCloseSection: true
        };
    }

    public onButtonTap(): void {
        this.navigateToDashboard('e-wallet', 'slideRight');
    }

    public onCloseTap(): void {
        this.onButtonTap();
    }
}
