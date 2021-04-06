import { Injectable, Type } from '@angular/core';
import { BottomSheetOptions, BottomSheetService } from 'nativescript-material-bottomsheet/angular';
import { Observable } from 'rxjs';
import { BottomDialogComponent } from '~/app/shared/components/bottom-dialog/bottom-dialog.component';
import { localize } from 'nativescript-localize';
import { DialogResult } from '~/app/shared/app.enums';
import {
    BottomDialogButtonType,
    BottomDialogConfig,
    Orientation,
    YesNoDialogConfig
} from '~/app/shared/models/bottom-dialog.config';
import { ModalDialogOptions, ModalDialogService } from 'nativescript-angular';

type ModalCallback = (...args: any[]) => void;

@Injectable({
    providedIn: 'root'
})
export class OmroModalService {
    static readonly defaultYesNoConfig: Partial<YesNoDialogConfig> = {
        yesText: localize('Common.Yes'),
        noText: localize('Common.No'),
        yesButtonType: BottomDialogButtonType.Transparent,
        noButtonType: BottomDialogButtonType.Transparent
    };
    private modalCallback: ModalCallback;

    constructor(private bottomSheetService: BottomSheetService, private modalDialogService: ModalDialogService) {}

    /**
     * Displays a dialog in a modal bottom sheet
     * @param config
     */
    public showBottomDialog<T>(config: BottomDialogConfig<T>): Observable<T> {
        config.orientation = config.orientation | Orientation.Horizontal;
        const options: BottomSheetOptions = {
            viewContainerRef: config.viewContainerRef,
            transparent: true,
            context: config
        };
        return this.showBottomSheet(BottomDialogComponent, options);
    }

    /**
     * Displays a YES/NO dialog in a modal bottom sheet
     * @param config
     */
    public showYesNoDialog(config: YesNoDialogConfig) {
        config = { ...OmroModalService.defaultYesNoConfig, ...config };
        return this.showBottomDialog({
            title: config.title,
            message: config.message,
            viewContainerRef: config.viewContainerRef,
            actions: [
                {
                    text: config.yesText,
                    buttonType: config.yesButtonType,
                    result: DialogResult.Yes
                },
                {
                    text: config.noText,
                    buttonType: config.noButtonType,
                    result: DialogResult.No
                }
            ]
        });
    }

    /**
     * Displays a component in a modal bottom sheet
     */
    public showBottomSheet<T = any>(type: Type<any>, options: BottomSheetOptions): Observable<T> {
        return this.bottomSheetService.show(type, options);
    }

    /**
     * Displays a component in a modal
     */
    public showModal(type: Type<any>, options: ModalDialogOptions): Promise<any> {
        return this.modalDialogService.showModal(type, options);
    }

    /**
     * Closes the last opened modal
     */
    public closeLastModal() {
        if (this.modalCallback) {
            this.modalCallback();
            this.modalCallback = null;
        }
    }

    /**
     * Registers the close callback here so it can be closed when the application suspends
     */
    public registerModalCallback(closeCallback: ModalCallback) {
        this.modalCallback = closeCallback;
    }
}
