import { Injectable } from '@angular/core';
import { MessagingService } from '~/app/core/services/messaging.service';
import { ProductRequestEvents, UploadDocuments } from '~/app/shared/constants';
import { CreditRequestService } from '~/app/credit-request/services/credit-request.service';
import { UiService } from '~/app/credit-request/services/ui.service';
import { RouterExtensions } from 'nativescript-angular';
import { traceDebug } from '~/app/core/logging/logging-utils';
import { QuestionnaireClosedEventArgs } from '~/app/credit-request/questionnaire/models/questionnaire-closed-event-args';
import { UploadFileInputModel } from '~/app/upload-documents/models/upload-file-input-model';
import { Feature } from '~/app/core/models/feature';
import { take } from 'rxjs/internal/operators';
import { NavigationExtras } from '@angular/router';
import { ProductRequestFlowViewModel } from '~/app/credit-request/services/product-request-flow-view-model';
import { FileRepositoryOutputModel } from '~/app/credit-request/models/fileRepositoryOutputModel';
import { StageType } from '~/app/credit-request/services/stage-type.model';
import { UploadFinishedModel } from "~/app/upload-documents/models/upload-finished-model";
import { UserProfileStateService } from "../../core/services/profile/user-profile-state.service";

@Injectable({
    providedIn: 'root'
})
export class CreditRequestControllerService {
    private _subscribed: boolean = false;

    constructor(
        private messagingService: MessagingService,
        private creditRequestService: CreditRequestService,
        private uiService: UiService,
        private routerExtensions: RouterExtensions,
        private userProfileStateService: UserProfileStateService
    ) {
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        this.messagingService
            .getEvent<ProductRequestFlowViewModel>(ProductRequestEvents.ProductRequestCancelled)
            .subscribe(param => this.handleProductCancelled(param));

        this.messagingService
            .getEvent<QuestionnaireClosedEventArgs>(ProductRequestEvents.QuestionnaireCompleted)
            .subscribe((param: QuestionnaireClosedEventArgs) => {
                if (param.completed) {
                    this.showCurrentStage(true);
                }
            });

        this.messagingService
            .getEvent(ProductRequestEvents.InitiateProductRequestCompleted)
            .subscribe(() => this.showCurrentStage());

        this.messagingService
            .getEvent(ProductRequestEvents.CheckOfferStatusCompleted)
            .subscribe(() => this.showCurrentStage(true));

        this.messagingService
            .getEvent(ProductRequestEvents.ProductSelectionCompleted)
            .subscribe(() => this.showCurrentStage());

        this.messagingService
            .getEvent(ProductRequestEvents.UvpCompleted)
            .subscribe(() => this.initiateProductRequest(false));
            
        this.messagingService
            .getEvent<UploadFinishedModel>(ProductRequestEvents.UploadDocumentsFinished)
            .subscribe((param: UploadFinishedModel) => {
                if (param.areFilesUploadedOnAllSets){
                    this.userProfileStateService.userProfile$.subscribe( up => {
                        if ( up.isKYCDataAvailable === true && up.isKYCUpdateRequired === false ){
                            this.redirectToHome();
                        }
                        else{
                            this.showKyc();
                        }
                    })
                }
            });

        this._subscribed = true;
    }

    public showKyc() {
        this.messagingService.setState('kyc-state', {
            source: Feature.ProductRequest
        });
        this.routerExtensions.navigate(['/kyc'], {
            transition: {
                name: "fade"
            }
        });
    }

    public initiateProductRequest(showUvp = false) {
        traceDebug('[CreditRequestController] Initiate product request');
        if (showUvp) {
            this.redirectToStage(StageType.Uvp);
        } else {
            this.redirectToStage(StageType.InitiateProductRequest);
        }
    }

    public showCurrentStage(reload = false) {
        traceDebug('[CreditRequestController] Show current stage');
        if (reload) {
            this.creditRequestService.reload();
        }
        this.creditRequestService
            .getCurrentProductRequest()
            .pipe(take(1))
            .subscribe(product => {
                const stageDetails = product.currentStage.stageDetails;
                if (stageDetails.stageType === StageType.FileRepository) {
                    this.showFileRepositoryStage(stageDetails.fileRepository, product.currentStage.title);
                } else if (stageDetails.stageType === StageType.Generic) {
                    this.showGenericStage(product);
                } else {
                    this.redirectToStage(StageType.Current);
                }
            });
    }

    private showGenericStage(product: ProductRequestFlowViewModel) {
        const stageDetails = product.currentStage.stageDetails;
        if (stageDetails.generic.mainAction === 'FileRepository') {
            this.showFileRepositoryStage(product.genericStepsRepository, stageDetails.generic.title);
        } else {
            this.redirectToStage(StageType.Current);
        }
    }

    private showFileRepositoryStage(fileRepository: FileRepositoryOutputModel, title: string) {
        this.messagingService.setState(UploadDocuments.Input, <UploadFileInputModel>{
            fileRepositoryId: fileRepository.fileRepositoryId,
            source: Feature.ProductRequest,
            pageTitle: title
        });
        this.redirectToStage(StageType.FileRepository);
    }

    private async handleProductCancelled(productRequest: ProductRequestFlowViewModel): Promise<void> {
        this.redirectToHome();
    }

    private redirectToHome() {
        this.routerExtensions.navigate(['/dashboard', { outlets: { dashboard: ['home'] }, clearHistory: true }]);
    }

    private redirectToStage(stage: StageType, extras?: NavigationExtras) {
        this.redirectTo(`credit-request/stage-details/${stage}`, extras);
    }

    private redirectTo(path: string, extras?: NavigationExtras): void {
        this.routerExtensions.navigate([path], {
            clearHistory: false,
            transition: { name: 'fade' },
            ...extras
        });
    }
}
