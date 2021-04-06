import { Injectable, NgZone, ViewContainerRef } from '@angular/core';
import { NotificationCallToActionTypeEnum } from "~/app/core/models/notifications/notificationCallToActionTypeEnum";
import { NotificationTypeEnum } from "~/app/core/models/notifications/notificationTypeEnum";
import { OmroModalService } from "~/app/shared/services/omro-modal.service";
import { SimpleModalComponent } from "~/app/shared/components/simple-modal/simple-modal.component";
import { ModalCloseResponse } from "~/app/shared/components/simple-modal/modal-close-response";
import { MessagingService } from "~/app/core/services/messaging.service";
import { SimpleModalModel } from "~/app/shared/components/simple-modal/simple-modal-model";
import { traceDebug } from "~/app/core/logging/logging-utils";
import { localize } from "nativescript-localize";
import { NotificationCallToActionLocationEnum } from "~/app/core/models/notifications/notificationCallToActionLocationEnum";
import { RouterExtensions } from 'nativescript-angular';
import { UserProfileStateService } from "~/app/core/services/profile/user-profile-state.service";
import { PushMessageModel } from "~/app/core/models/notifications/push-message-model";
import { CreditRequestService } from "~/app/credit-request/services/credit-request.service";

/*
* This class is responsible for handling a push notification message. This normally involves
* showing a modal window and navigating away to a specific screen.
* */
@Injectable({
    providedIn: 'root'
})
export class PnHandlerService {
    constructor(private modalService: OmroModalService,
                private messagingService: MessagingService,
                private ngZone: NgZone,
                private router: RouterExtensions,
                private userProfileService: UserProfileStateService,
                private creditRequestService: CreditRequestService) {
    }

    public async handleMessage(message: PushMessageModel): Promise<void> {
        if (message.notificationType === NotificationTypeEnum.Modal ||
            message.notificationType === NotificationTypeEnum.DismissableModal) {
            const context = {
                model: <SimpleModalModel>{
                    title: message.dataTitle,
                    body: message.dataBody,
                    buttonCaption: localize('Common.Continue'),
                    showCloseButton: message.notificationType === NotificationTypeEnum.DismissableModal
                }
            };

            let modalResponse: ModalCloseResponse = null;
            await this.ngZone.run(async () => {
                modalResponse = await this.showModal(context);
            });

            if (modalResponse.callToActionExecuted) {
                await this.modalCallToAction(message);
            }
        }
    }

    private showModal(context?: any): Promise<ModalCloseResponse> {
        return new Promise<ModalCloseResponse>((resolve, reject) => {
            this.messagingService.getState<ViewContainerRef>('vcRef')
                .subscribe(async vcRef => {
                    const options = {
                        context: context || {},
                        fullscreen: true,
                        viewContainerRef: vcRef,
                        animated: true
                    };

                    let response: ModalCloseResponse = null;
                    try {
                        response = await <Promise<ModalCloseResponse>>this.modalService.showModal(SimpleModalComponent, options);
                        traceDebug('Response from modal is: ' + JSON.stringify(response));
                        resolve(response);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
        });
    }

    private modalCallToAction(message: PushMessageModel): Promise<boolean> {
        traceDebug('Modal call to action STARTED');
        if (message.callToActionType === NotificationCallToActionTypeEnum.Navigate) {
            traceDebug('Navigating to: ' + message.callToActionLocation);
            switch (message.callToActionLocation) {
                case NotificationCallToActionLocationEnum.UserProfile: {
                    return this.redirectTo(`profile`, true);
                }
                case NotificationCallToActionLocationEnum.CompanySetup: {
                    this.updateCustomerId(message.customerId);
                    return this.redirectTo(`profile/company/${message.customerId}/details`, false);
                }
                case NotificationCallToActionLocationEnum.ProductApplicationRequest: {
                    this.updateCustomerId(message.customerId);
                    const productRequestId = message.callToActionReference;
                    this.updateProductRequestId(productRequestId);
                    this.creditRequestService.invalidateCache();
                    this.router.navigate(['credit-request/credit-overview', productRequestId]);
                }
                default: {
                    return this.redirectTo('');
                }
            }
        }

        return Promise.resolve(false);
    }

    private redirectTo(path: string, withinDashboard: boolean = false): Promise<boolean> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.ngZone.run(async () => {
                    const result =
                        withinDashboard ?
                            await this.router.navigate(['/dashboard', { outlets: { dashboard: [path] } }],
                                {transition: {name: "fade"}}) :
                            await this.router.navigate([path], {transition: {name: "fade"}});
                    resolve(result);
                });
            }, 50);
        });
    }

    private updateCustomerId(customerId: string): void {
        if (customerId) {
            this.userProfileService.setCurrentCustomer(customerId);
        }
    }

    private updateProductRequestId(productRequestId: string): void {
        if (productRequestId) {
            this.creditRequestService.currentProductRequestId = productRequestId;
        }
    }
}
