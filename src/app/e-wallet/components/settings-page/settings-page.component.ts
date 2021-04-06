import { Component, OnInit } from '@angular/core';
import { Page } from 'tns-core-modules/ui/page/page';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { Observable } from 'rxjs';
import { SettingsPageService } from './settings-page.service';
import { FormGroup, FormControl } from '@angular/forms';
import { tap, map, switchMap, take } from 'rxjs/operators';
import { CardSettingOutputModel, CardSettingModel } from '../../models/api';
import { NotificationBannerService } from '~/app/shared/services';
import localize from 'nativescript-localize';

@Component({
    selector: 'omro-settings-page',
    templateUrl: './settings-page.component.html',
    styleUrls: ['./settings-page.component.scss'],
    providers: [SettingsPageService]
})
export class SettingsPageComponent extends BaseComponent implements OnInit {
    public vm$: Observable<any>;
    public formGroup: FormGroup;

    constructor(
        routerExtensions: RouterExtensions,
        private page: Page,
        private controllerService: SettingsPageService,
        private notificationBannerService: NotificationBannerService
    ) {
        super(routerExtensions);
        this.page.actionBarHidden = true;
    }

    public onCloseButtonTap(): void {
        super.goBack();
    }

    public ngOnInit(): void {
        this.vm$ = this.controllerService.settingsPageVM$.pipe(
            tap((data) => this.createFormDynamically(data.settings).then((done) => this.startToListenForChanges()))
        );
    }

    private createFormDynamically(settings: CardSettingOutputModel[]): Promise<void> {
        return new Promise((resolve) => {
            let group = {};
            settings.forEach((s) => (group[s.settingId] = new FormControl(s.enabled)));
            this.formGroup = new FormGroup(group);
            resolve();
        });
    }

    private startToListenForChanges(): void {
        let currentState = { ...this.formGroup.value };
        this.formGroup.valueChanges
            .pipe(
                map((value) => {
                    const changedSettingId = Object.keys(value).find((key) => value[key] !== currentState[key]);
                    currentState = { ...value };
                    return  <CardSettingModel>{ settingId: changedSettingId, enabled: value[changedSettingId] };
                })
            )
            .pipe(switchMap((updateModel) => this.controllerService.updateCardSetting(updateModel).pipe(take(1))))
            .subscribe(
                (success) =>
                    this.notificationBannerService.showSuccess(
                        localize('EWallet.Configuration.Settings.UpdateSuccessTitle'),
                        localize('EWallet.Configuration.Settings.UpdateSuccessDescription'),
                        2000
                    ),
                (error) => this.notificationBannerService.showGenericError()
            );
    }
}
