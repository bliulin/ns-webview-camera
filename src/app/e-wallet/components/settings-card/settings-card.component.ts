import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '~/app/shared/base.component';
import { RouterExtensions } from 'nativescript-angular';
import { SettingsProvider } from '../../services/settings-provider';
import { SettingAction, SettingsSection } from '../../models/settings-section';
import { Observable, timer } from 'rxjs';
import { CardModifyStateAction } from '../../models';
import { EWalletStateService } from '../../services/e-wallet-state.service';
import { map, takeUntil, mergeMap, take, filter, delay, tap } from 'rxjs/operators';
import { ApplicationService } from '~/app/core/services/application.service';
import { traceDebug } from '~/app/core/logging/logging-utils';
import { DialogResult } from '~/app/shared/app.enums';
import { CardBlockReason, CardBlockModel } from '../../models/api';
import { ConfigurationService } from './configuration.service';
import { NotificationBannerService } from '~/app/shared/services';
import { BlockCardReasonsModalResult } from '..';
import localize from 'nativescript-localize';

@Component({
    selector: 'omro-card-settings-card',
    templateUrl: './settings-card.component.html',
    styleUrls: ['./settings-card.component.scss'],
    providers: [SettingsProvider, ConfigurationService]
})
export class SettingsCardComponent extends BaseComponent implements OnInit {
    public settings$: Observable<SettingsSection[]>;
    constructor(
        routerExtensions: RouterExtensions,
        application: ApplicationService,
        private containerRef: ViewContainerRef,
        private settingsProvider: SettingsProvider,
        private stateService: EWalletStateService,
        private configurationService: ConfigurationService,
        private notificationBannerService: NotificationBannerService
    ) {
        super(routerExtensions, application);
    }

    public ngOnInit(): void {
        this.settings$ = this.stateService.currentSelectedCard$.pipe(
            map((model) => this.settingsProvider.getSettings(model.uiState))
        );
    }

    public onSettingTap(action: SettingAction): void {
        switch (action) {
            case SettingAction.TransactionLimit:
                this.stateService.currentCardLimits$.pipe(takeUntil(this.unsubscribe$)).subscribe((response) =>
                    this.configurationService
                        .showTransactionsLimitsModal(this.containerRef)
                        .subscribe((selectedTradingLimitId: string) => {
                            if (selectedTradingLimitId) {
                                this.redirectTo(`e-wallet/configuration/${selectedTradingLimitId}/details`);
                            }
                        })
                );
                break;
            case SettingAction.Settings:
                this.application.authorizeAction().subscribe(
                    (authorized) => this.redirectTo(`e-wallet/configuration/settings`, false, 'fade'),
                    (notAuthorized) => traceDebug('User has no authorization to see settings!')
                );

                break;

            case SettingAction.ChangePin:
                this.application.authorizeAction().subscribe(
                    (authorized) => this.redirectTo(`e-wallet/configuration/change-pin/set`, false, 'fade'),
                    (notAuthorized) => traceDebug('User has no authorization to change card pin!')
                );
                break;

            case SettingAction.BlockCard:
                this.handleBlockCard();
                break;

            case SettingAction.ActivateCard:
                this.handleActivateCard();
                break;
            default:
                break;
        }
    }

    private handleActivateCard(): void {
        this.configurationService
            .showActivateCardConfiramtion(this.containerRef)
            .pipe(
                filter((response) => response === DialogResult.Yes),
                mergeMap(() => this.configurationService.makeAction(CardModifyStateAction.Activate)),
                take(1)
            )
            .subscribe(
                (succes) => {
                    this.notificationBannerService.showSuccess(
                        localize('Common.GenericSuccessMessage.title'),
                        localize('Common.GenericSuccessMessage.detail'),
                        2000
                    );
                    this.stateService.reload();
                },
                (error) => this.notificationBannerService.showGenericError()
            );
    }

    private handleBlockCard(): void {
        let reasons: CardBlockReason;
        this.configurationService
            .showBlockCardReasonsModal(this.containerRef)
            .pipe(
                filter((result) => result && result.dialogResult === DialogResult.Yes),
                tap((result) => (reasons = (result.selectedReasons as unknown) as CardBlockReason)),
                delay(300),
                mergeMap(() => this.configurationService.showBlockCardConfirmation(this.containerRef)),
                filter((res) => res === DialogResult.Yes),
                mergeMap(() => this.configurationService.makeAction(CardModifyStateAction.Block, reasons)),
                take(1)
            )
            .subscribe(
                (succes) => {
                    this.notificationBannerService.showSuccess(
                        localize('Common.GenericSuccessMessage.title'),
                        localize('Common.GenericSuccessMessage.detail'),
                        2000
                    );
                    this.stateService.reload();
                },
                (error) => this.notificationBannerService.showGenericError()
            );
    }
}
