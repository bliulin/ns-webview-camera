import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { overrideLocale, localize } from 'nativescript-localize/localize';
import { device } from '@nativescript/core/platform';
import { SettingsSection, SettingAction } from '../../models';
import { LocaleService } from '~/app/core/services/locale.service';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { OmroModalService } from '~/app/shared/services/omro-modal.service';
import { DialogResult } from '~/app/shared/app.enums';
import { filter, switchMap, take, catchError } from 'rxjs/operators';
import * as appSettings from 'tns-core-modules/application-settings';
import { throwError } from 'rxjs';
import { SettingsApiService } from '../../services/settings-api.service';
import { NotificationBannerService } from '~/app/shared/services';
import { BiometricIDAvailableResult } from 'nativescript-fingerprint-auth';
import { Authentication } from '~/app/shared/constants';
import { BottomDialogButtonType } from '~/app/shared/models/bottom-dialog.config';
import { SettingsProvider } from '../../services/settings-provider';
import { AuthorizationService } from '~/app/unlock/authorization.service';
import { AnalyticsService } from "~/app/core/services/analytics.service";
import { AppInsightsUserProfileEvents } from "~/app/core/models/app-insights-events";

@Component({
    selector: 'omro-settings-card',
    templateUrl: './settings-card.component.html',
    styleUrls: ['./settings-card.component.scss']
})
export class SettingsCardComponent extends BaseComponent implements OnInit {
    public settings: SettingsSection[];

    constructor(
        routerExtensions: RouterExtensions,
        public authorizationService: AuthorizationService,
        private localeService: LocaleService,
        private containerRef: ViewContainerRef,
        private dialogService: OmroModalService,
        private settingsService: SettingsApiService,
        private notificationBannerService: NotificationBannerService,
        private analyticsService: AnalyticsService
    ) {
        super(routerExtensions);
    }

    public ngOnInit(): void {
        this.authorizationService
            .biometricsAvailable()
            .then(
                (biometrics: BiometricIDAvailableResult) => (this.settings = SettingsProvider.getSettings(biometrics))
            );
    }

    public onSettingTap(action: SettingAction): void {
        switch (action) {
            case SettingAction.Notifications:
                /* Go to notification */
                alert("Next you'll be redirected to notifications page");
                break;
            case SettingAction.SetLanguage:
                this.changeLanguage();
                break;
            case SettingAction.ChangePIN:
                this.onChangePinTap();
                break;
            case SettingAction.ResetPassword:
                this.tryResetPassword();
                break;
            case SettingAction.LogOut:
                this.redirectTo('login/logout');
                break;
            default:
                break;
        }
    }

    public isLastChild(index: number): boolean {
        return index === this.settings.length - 1;
    }

    public onChangePinTap(): void {
        this.redirectTo('/profile/settings/change-pin/set');
    }

    public get biometricsEnabled(): boolean {
        return Boolean(appSettings.getBoolean(Authentication.BiometricsEnabled));
    }
    private get isFirstTimeBiometricSet(): boolean {
        return !appSettings.hasKey(Authentication.BiometricsEnabled);
    }
    public onCheckedChange(event: any): void {
        if (this.isFirstTimeBiometricSet && event.value) {
            this.redirectTo('/profile/settings/activate-biometric');
        } else {
            appSettings.setBoolean(Authentication.BiometricsEnabled, event.value);
        }
    }

    private changeLanguage(): void {
        const language = device.language.split('-')[0];
        // console.log("user's language is", device.language.split('-')[0]);
        if (language === 'en') {
            const localeOverriddenSuccessfully = overrideLocale('ro-RO');
            this.localeService.currentLocale = 'ro-RO';

            if (localeOverriddenSuccessfully) {
                alert('Language is now Romanian');
            }
        } else {
            const localeOverriddenSuccessfully = overrideLocale('en-US');
            this.localeService.currentLocale = 'en-US';

            if (localeOverriddenSuccessfully) {
                alert('Language is now English');
            }
        }
    }

    private tryResetPassword(): void {
        const config = {
            viewContainerRef: this.containerRef,
            title: localize('Common.AreYouSure'),
            message: localize('Profile.Settings.AreYouSureYouWantToReset'),
            actions: [
                {
                    buttonType: BottomDialogButtonType.Error,
                    text: localize('Profile.Settings.YesReset'),
                    result: DialogResult.Yes
                },
                {
                    buttonType: BottomDialogButtonType.Transparent,
                    text: localize('Common.No'),
                    result: DialogResult.No
                }
            ]
        };

        this.dialogService
            .showBottomDialog(config)
            .pipe(filter((r) => r === DialogResult.Yes))
            .pipe(switchMap(() => this.settingsService.resetPassword()))
            .pipe(take(1))
            .pipe(
                catchError((err) => {
                    this.analyticsService.trackEvent(AppInsightsUserProfileEvents.PasswordResetError, this.routerExtensions.router.url, err);
                    this.notificationBannerService.showGenericError();
                    return throwError(err);
                })
            )
            .subscribe((res) => {
                this.analyticsService.trackEvent(AppInsightsUserProfileEvents.PasswordResetOK, this.routerExtensions.router.url, res);
                this.routerExtensions.navigate(['profile/settings/password-reset-confirmation'], {
                    transition: { name: 'slideLeft' },
                    queryParams: {
                        title: res.title,
                        details: res.details
                    }
                });
            });
    }
}
