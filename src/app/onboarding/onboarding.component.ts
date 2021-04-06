import { Component } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { BaseUvpComponent } from '../shared/base-uvp.component';
import * as appSettings from 'tns-core-modules/application-settings';
import { Onboarding } from '../shared/constants';
import { ApplicationService } from "~/app/core/services/application.service";

@Component({
    selector: 'omro-onboarding',
    moduleId: module.id,
    templateUrl: './onboarding.component.html'
})
export class OnboardingComponent extends BaseUvpComponent {
    constructor(private page: Page, private application: ApplicationService) {
        super();
        this.page.actionBarHidden = true;
    }
    public set onboardingCompleted(value: boolean) {
        appSettings.setBoolean(Onboarding.onboardingCompleted, value);
    }

    public onSkipTap(): void {
        this.application.goHome();
    }

    public onScreenChanged(page: any): void {
        this.updateSelectedScreenIndex(page.index);
    }

    public onButtonTap(): void {
        this.handleButtonTap();
    }

    protected finish() {
        this.application.goHome();
    }
}
